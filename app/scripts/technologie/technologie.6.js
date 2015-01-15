/*global Raphael*/
function Technologie(dataDivisions, filter, CompoundObserver){
	var self = this;
	self.view = {};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var observer = new CompoundObserver();
		observer.addPath(filter, 'year');
		observer.addPath(filter, 'canton');
		observer.open(function(newValues){
			var [year, canton]  = newValues;
			var sections = ['internet', 'post', 'mobil', 'festnetz'];
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){
				self.view.sections = sections;
				var total = resolved.reduce((sum, r) => {return sum + r;}, 0);
				var technologies = resolved.map(function(value, i){
					return {
						'label': sections[i],
						'relative': value / total,
						'absolute': value
					};
				});

				var container = document.querySelector('#circles');
				while (container.firstChild) {
				    container.removeChild(container.firstChild);
				}
				var sectionWidth = 100;
				var width = technologies.length * sectionWidth;
				var height = 80;
				var raphPaper = new Raphael(container, width, height);
				technologies.forEach((date, idx)=> {
					var centerX = ((idx+1)*sectionWidth - idx*sectionWidth)/2 + idx*sectionWidth;
					var hebel = 30;
					var radiusMin = 1;
					var radius = radiusMin+hebel*date.relative;
					var radiusMax = radiusMin+hebel*1;
					var centerY = radiusMax+20;
					if(date.label !== 'mobil'){radius = radius * 7;}
				    var circle = raphPaper.circle(centerX, centerY, radius);
				    circle.attr('fill', '#333333');
				    var value = raphPaper.text(centerX, centerY + radiusMax + 10, date.absolute);
				    value.attr('fill', '#333333');
				    value.attr({'font-size': 14, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});
				    var name = raphPaper.text(centerX, centerY - radiusMax - 10, date.label);
				    name.attr('fill', '#333333');
				    name.attr({'font-size': 14, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});
			    });
			});
		});
	}

	function render(){
		var template = require('./technologie.jade');
		var html = template({view: this.view});
		$('#technologie').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Technologie;