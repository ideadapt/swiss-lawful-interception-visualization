/*global Raphael, numeral*/
function Technologie(dataDivisions, filter){
	var self = this;
	self.view = {};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = ['mobil', 'festnetz', 'internet', 'post'];
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
				var sectionWidth = 120;
				var height = 160;
				var width = technologies.length * sectionWidth;
				var raphPaper = new Raphael(container, width, height);
				technologies.forEach((date, idx)=> {
					var centerX = ((idx+1)*sectionWidth - idx*sectionWidth)/2 + idx*sectionWidth;
					var hebel = 40;
					var radiusMin = 1;
					var radius = radiusMin+hebel*date.relative;
					var radiusMax = radiusMin+hebel;
					var centerY = radiusMax+20;
					if(date.absolute === 0){
						radius = 0;
					}

				    var circle = raphPaper.circle(centerX, centerY, radius);
				    circle.attr('fill', '#333333');

				    var value = raphPaper.text(centerX, centerY + radiusMax + 15, numeral(date.absolute).format());
				    value.attr('fill', '#333333');
				    value.attr({'font-size': 12, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});

				    var name = raphPaper.text(centerX, centerY - radiusMax - 15, window.i18n.l('technologie_txt_'+date.label));
				    name.attr('fill', '#333333');
				    name.attr({'font-size': 12, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});
			    });
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);
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