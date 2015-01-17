/*global nv, d3*/
function Delikt(dataDivisions, filter, CompoundObserver){
	var self = this;
	self.view = {};
	 self.view.colors = [
		'#282828',
		'#109618',
		'#668CD9',
		'#FE0405',
		'#B2FF66',
		'#9C14DB',
		'#FF6767',
		//'#1439DA',
		'#C2943E',
		'#86BAFA',
		'#BEC3BE'];

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var observer = new CompoundObserver();
		observer.addPath(filter, 'year');
		observer.addPath(filter, 'canton');
		observer.open(function(newValues){
			var [year, canton]  = newValues;
			var sections = ['drogen', 'drohung', 'finanz', 'gewalt', 'sex', 'oeFrieden', 'staat', 'vermoegen', 'buepf', 'diverse'];
			var colors = self.view.colors;
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){

				self.view.sections = sections;
				self.view.sectionValues = {};
				resolved.forEach(function(value, i){
					self.view.sectionValues[sections[i]] = {
						value: value,
						key: window.i18n.l('deliktegruppe_txt_'+sections[i]),
						color: colors[i],
						rgb: ['r', 'g', 'b'].map((v) => { return d3.rgb(colors[i])[v]; }).join(', ')
					};
				});
				render.call(self);

				nv.addGraph(function() {
				    var chart = nv.models.pieChart();
			    	chart.donut(true);
				    chart.height(450);
				    chart.width(450);
				    chart.tooltips(false);
				    chart.showLabels(true);
				    chart.showLegend(false);
				    chart.labelType('percent');
				    chart.donutRatio(0.618);
				    chart.donutLabelsOutside(true);
				    chart.labelThreshold(0);
				    chart.x(function(d) { return d.label; })
						 .y(function(d) { return d.value; });
					d3.scale.slirColors = () => {
				        return d3.scale.ordinal().range(colors);
				    };
				    chart.color(d3.scale.slirColors().range());

				    var series = resolved.map((section, idx) => {
				    	return {
				    		label: window.i18n.l('DELIKTEGRUPPE_TXT_'+sections[idx]),
				    		value: resolved[idx]
				    	};
					});

					d3.select('#delikt>svg').datum(series)
				    	.transition()
				    	.duration(250)
				    	.call(chart);

			    	nv.utils.windowResize(chart.update);
			 	});
			});
		});

		return Promise.resolve();
	}

	function render(){
		var template = require('./deliktTable.jade');
		var html = template({view: this.view});
		$('#deliktTable').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Delikt;