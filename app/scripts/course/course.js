/*global nv, d3*/
function Course(dataSummary, tooltipTemplate){
	//var self = this;

	function controller(){

		nv.addGraph(function() {
		    var chart = nv.models.multiBarChart();
		    chart.multibar.stacked(true); // default to stacked
		    chart.showControls(false); // don't show controls
		    chart.height(300);
		    chart.reduceXTicks(false);

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
			    	view.activ = tooltip[x].Aktiv;
			    	view.vds = tooltip[x].VDS;
			    	view.techadm = tooltip[x].TechAdm;
			    	view.tel = tooltip[x].Tel;
			    	view.year = x;
			    	console.log('view', view);
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

		    //chart.xAxis.tickFormat(d3.format(',f'));
		    chart.yAxis.tickFormat(d3.format(''));

		    nv.utils.windowResize(chart.update);

		    return chart;
		});
	}

	controller.call(this);
}

module.exports = Course;