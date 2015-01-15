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
			var sections = ['oeFrieden', 'staat', 'sex', 'buepf', 'diverse', 'drogen', 'drohung', 'finanz', 'gewalt', 'vermoegen'];
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){

				nv.addGraph(function() {
				    var chart = nv.models.multiBarChart();
				    	chart.multibar.stacked(true);
				    	chart.showControls(false)
					    .height(600)
					    .width(300)
					    .reduceXTicks(false);
					    chart.groupSpacing(0.8);
					    //.color(['#FE0405', '#9BBB59', '#668CD9']);

				    var series = resolved.map((section, idx) => {
				    	return {
				    		key: window.i18n.l('DELIKTEGRUPPE_TXT_'+sections[idx]),
				    		values: [{x: year, y: resolved[idx] }]
				    	};
					});

					d3.select('#delikt>svg').datum(series)
				    	.transition()
				    	.duration(250)
				    	.call(chart);
				});
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