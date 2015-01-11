/*global Raphael*/
function Technologie(){
	var self = this;
	self.view = {};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var paper3;
		var dates = [{
		        	'label': 'Mobil',
		        	'value': 0.1
		        },{
		        	'label': 'Festnetz',
		        	'value': 0.5
		        },
		        {
		        	'label': 'Allerlei',
		        	'value': 1
		        }];
		var sectionWidth = 100;
		var width = dates.length * sectionWidth;
		var height = 60;
		paper3 = new Raphael(document.querySelector('#circles'), width, height);
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