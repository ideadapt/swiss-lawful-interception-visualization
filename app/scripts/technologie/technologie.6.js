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
			var sections = ['internet', 'post', 'notsuche'];
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){
				self.view.sections = sections;
				var total = resolved.reduce((sum, r) => {return sum + r;}, 0);
				var dates = resolved.map(function(value, i){
					return {
						'label': sections[i],
						'value': value / total
					};
				});
				console.log(dates);
				var container = document.querySelector('#circles');
				while (container.firstChild) {
				    container.removeChild(container.firstChild);
				}
				var sectionWidth = 100;
				var width = dates.length * sectionWidth;
				var height = 60;
				var paper3 = new Raphael(container, width, height);
				dates.forEach((date, idx)=> {
					var centerX = ((idx+1)*sectionWidth - idx*sectionWidth)/2 + idx*sectionWidth;
					var hebel = 30;
					var radiusMin = 10;
					var radius = radiusMin+hebel*date.value;
					var radiusMax = radiusMin+hebel*1;
					var centerY = radiusMax+10;

				    var circle3 = paper3.circle(centerX, centerY, radius);
				    circle3.attr('fill', '#333333');
				    var text3 = paper3.text(centerX, centerY + radiusMax + 10, date.label);
				    text3.attr('fill', '#333333');
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