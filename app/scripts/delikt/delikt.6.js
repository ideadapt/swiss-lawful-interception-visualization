/*global nv, d3*/
function Delikt(dataDivisions, filter, CompoundObserver){
	//var self = this;

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
			var colors = [
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
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){

				nv.addGraph(function() {
				    var chart = nv.models.multiBarHorizontalChart();
				    	chart.stacked(true);
				    	chart.showControls(false);
					    chart.height(200);
					    chart.tooltips(false);
					    chart.width(1200);

				    var series = resolved.map((section, idx) => {
				    	return {
				    		key: window.i18n.l('DELIKTEGRUPPE_TXT_'+sections[idx]),
				    		values: [{x: year, y: resolved[idx] }]
				    	};
					});

					for (var property in chart.legend.dispatch) {
					    chart.legend.dispatch[property] = function() { };
					}

					d3.select('#delikt>svg').datum(series)
				    	.transition()
				    	.duration(250)
				    	.call(chart);
				});

				window.setTimeout(()=>{
					colors.forEach((color, idx) => {
						var value = $('#delikt .nv-series-'+idx).attr('style');
						value = $('#delikt .nv-series-'+idx).attr('style', value + ' fill: '+color +';').attr('style');
						$('#delikt .nv-series-'+idx).attr('style', value + ' fill-opacity: 1;');

						value = $('#delikt .nv-legend circle:eq('+idx+')').attr('style');
						value = $('#delikt .nv-legend circle:eq('+idx+')').attr('style', value = ' fill: '+color+';').attr('style');
						$('#delikt .nv-legend circle:eq('+idx+')').attr('style', value +' stroke: '+color);
					});

					$('#delikt .nv-legendWrap').attr('transform', 'translate(-30, -50)');

				}, 400);
			});
		});
	}

	init.call(this)
		.then(controller.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Delikt;