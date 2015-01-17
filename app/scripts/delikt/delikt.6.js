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
						number: value,
						prozent: 23,
						key: window.i18n.l('deliktegruppe_txt_'+sections[i]),
						color: colors[i]
					};
				});
				render.call(self);

				nv.addGraph(function() {
				    var chart = nv.models.pieChart();
				    	//chart.showLegend(false);
					    chart.height(600);
					    chart.width(600);
					    chart.tooltips(false);
					    chart.showLabels(true);
					    chart.showLegend(false);
					    chart.x(function(d) { return d.label; })
  							.y(function(d) { return d.value; });
  						d3.scale.myColors = function() {
					        return d3.scale.ordinal().range(colors);
					    };
					    chart.color(d3.scale.myColors().range());

				    var series = resolved.map((section, idx) => {
				    	return {
				    		label: window.i18n.l('DELIKTEGRUPPE_TXT_'+sections[idx]),
				    		value: resolved[idx]
				    		//key: window.i18n.l('DELIKTEGRUPPE_TXT_'+sections[idx])
				    	};
					});

					d3.select('#delikt>svg').datum(series)
				    	.transition()
				    	.duration(250)
				    	.call(chart);

			    	nv.utils.windowResize(chart.update);
				});

				// window.setTimeout(()=>{

				// 	colors.forEach((color, idx) => {
				// 		var series = $('#delikt .nv-series-'+idx);
				// 		var value = series.attr('style');
				// 		value = series.attr('style', value + ' fill: '+color +';').attr('style');
				// 		series.attr('style', value + ' fill-opacity: 1;');
				// 	});

				// 	$('#delikt .nv-legendWrap').attr('transform', 'translate(-30, -50)');

				// }, 400);
			});
		});
	}

	function render(){
		var template = require('./deliktTable.jade');
		var html = template({view: this.view});
		$('#deliktTable').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Delikt;