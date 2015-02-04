/*global Raphael*/
function Technologie(dataDivisions, filter, i18n){
	var numeral = i18n.numeral;
	var self = this;
	var artSections = ['telefon', 'notsuche', 'antennensuchlauf'];
	self.view = {
		mobileSections: []
	};

	function init(){
		addMobileDetails();
		return Promise.resolve();
	}

	function addMobileDetails(){
		self.view.mobileSections = artSections;
		self.view.mobileSections = artSections.map((section, idx) => {
			return {
				label: i18n.l('art_txt_'+artSections[idx]),
				value: 0
			};
		});
	}

	function updateMobileDetails(year, canton){
		var promises = artSections.map(function(section){
			return dataDivisions[section](year, canton);
		});

		Promise.all(promises).then(function(resolved){
			resolved.forEach((value, idx) => {
				self.view.mobileSections[idx].value = value;
				$('#mobile li').eq(idx).find(':nth-child(1)').text(numeral(value).format());
			});
		});
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = ['mobil', 'festnetz', 'internet', 'post'];
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			updateMobileDetails(year, canton);

			Promise.all(promises).then(function(resolved){
				self.view.sections = sections;
				var total = resolved.reduce((sum, r) => {return sum + r;}, 0);
				var technologies = resolved.map(function(value, idx){
					return {
						label: sections[idx],
						relative: value / total,
						absolute: value
					};
				});

				var container = document.querySelector('#circles');
				while (container.firstChild) {
				    container.removeChild(container.firstChild);
				}
				var sectionWidth = 120;
				var height = 120;
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
					}else if(sections[idx] === 'mobil' && date.absolute < 25){
						radius *= 0.35;
					}else if(sections[idx] === 'mobil' && date.absolute < 100){
						radius *= 0.4;
					}else if(sections[idx] === 'mobil' && date.absolute < 300){
						radius *= 0.6;
					}else if(sections[idx] === 'mobil' && date.absolute < 1000){
						radius *= 0.7;
					}else if(sections[idx] === 'mobil' && date.absolute < 2000){
						radius *= 0.8;
					}else if(sections[idx] === 'mobil' && date.absolute < 10000){
						radius *= 0.9;
					}

				    var circle = raphPaper.circle(centerX, centerY, radius);
				    circle.attr('fill', '#333333');

				    var value = raphPaper.text(centerX, centerY + radiusMax + 15, numeral(date.absolute).format());
				    value.attr('fill', '#333333');
				    value.attr({'font-size': 12, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});

				    var name = raphPaper.text(centerX, centerY - radiusMax - 15, i18n.l('technologie_txt_'+date.label));
				    name.attr('fill', '#333333');
				    name.attr({'font-size': 12, 'font-family': '\'Helvetica Neue\', Helvetica, Arial, sans-serif;'});
			    });
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);
	}

	function render(){
		var template = require('./technologie.jade');
		var html = template({view: this.view, l: i18n.l});
		$('#technologie').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Technologie;