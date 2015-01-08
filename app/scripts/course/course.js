/*global nv, d3, numeral*/
function Course(dataSummary, tooltipTemplate){
	//var self = this;

	function controller(){

		nv.addGraph(function() {
		    var chart = nv.models.multiBarChart();
		    chart.multibar.stacked(true); // default to stacked
		    chart.showControls(false); // don't show controls
		    chart.height(300);
		    chart.reduceXTicks(false);
		    chart.color(['#FE0405', '#9BBB59', '#668CD9']);

		    Promise.all([dataSummary.activ(),
		    	dataSummary.vorratsdaten(),
		    	dataSummary.tech(),
		    	dataSummary.tel()
		    	]).then(function(resolved){

		    	var activ = resolved[0];
		    	var vds = resolved[1];
		    	var tech = resolved[2];
		    	var tel = resolved[3];
		    	var tooltip = {};
				chart.tooltipContent(function(art, x) {
			    	//console.log(art, x, y, graph);
			    	var view = {};
			    	view.activ = numeral(tooltip[x].Aktiv).format();
			    	view.vds = numeral(tooltip[x].VDS).format();
			    	view.techadm = numeral(tooltip[x].TechAdm).format();
			    	view.tel = numeral(tooltip[x].Tel).format();
			    	view.year = x;
			    	view.total = 0;
			    	view.total = Object.keys(tooltip[x]).reduce(function(sum, key){
						return sum + tooltip[x][key];
					}, view.total);
					view.total = numeral(view.total).format();

			    	return tooltipTemplate(view);
		       	});

		       	tel.map(function(r){
	    			tooltip[r.year] = tooltip[r.year] || {};
		    		tooltip[r.year].Tel = r.value;
	    		});

			    d3.select('#course>svg').datum([{
			    	key: 'Aktiv',
			    	values: activ.map(function(r){
			    		tooltip[r.year] = tooltip[r.year] || {};
			    		tooltip[r.year].Aktiv = r.value;
		    			return {x: r.year, y: r.value};
		    		})
			    },{
			    	key: 'VDS',
			    	values: vds.map(function(r){
			    		tooltip[r.year] = tooltip[r.year] || {};
			    		tooltip[r.year].VDS = r.value;
		    			return {x: r.year, y: r.value};
		    		})
			    },
			    {
			    	key: 'TechAdm',
			    	values: tech.map(function(r){
			    		tooltip[r.year] = tooltip[r.year] || {};
			    		tooltip[r.year].TechAdm = r.value;
		    			return {x: r.year, y: r.value};
		    		})
			    }
			    ])
		    	.transition()
		    	.duration(250)
		    	.call(chart);
		    });

		    chart.yAxis.tickFormat(function(n){
		    	return numeral(n).format();
		    });

		    nv.utils.windowResize(chart.update);

		    return chart;
		});
	}

	controller.call(this);
}

module.exports = Course;