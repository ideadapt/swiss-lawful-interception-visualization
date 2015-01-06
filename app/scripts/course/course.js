/*global nv, d3*/
function Course(dataSummary){
	//var self = this;

	function controller(){
		//console.log('got data from service', data);

		nv.addGraph(function() {
		    var chart = nv.models.multiBarChart();
		    chart.multibar.stacked(true); // default to stacked
		    chart.showControls(false); // don't show controls
		    chart.height(300);

		    var valuesActiv = dataSummary.activ().then(function(data){
		    	return data;
		    });
		    var valuesVds = dataSummary.vorratsdaten().then(function(data){
		    	return data;
		    });
		    var valuesTech = dataSummary.tech().then(function(data){
		    	return data;
		    });
		    var valuesTel = dataSummary.tel().then(function(data){
		    	return data;
		    });

		    Promise.all([valuesActiv, valuesVds, valuesTech, valuesTel]).then(function(resolved){
		    	var activ = resolved[0];
		    	var vds = resolved[1];
		    	var tech = resolved[2];
		    	var tel = resolved[3];
			    d3.select('#course>svg').datum([{
			    	key: 'Aktiv',
			    	values: activ.map(function(r){
		    			return {x: r.year, y: r.value};
		    		})
			    },{
			    	key: 'VDS',
			    	values: vds.map(function(r){
		    			return {x: r.year, y: r.value};
		    		})
			    },
			    {
			    	key: 'TechAdm',
			    	values: tech.map(function(r){
		    			return {x: r.year, y: r.value};
		    		})
			    },
			    {
			    	key: 'Tel',
			    	values: tel.map(function(r){
		    			//return {x: r.year, y: r.value};
		    			return {x: r.year, y: 0}; // out of scale
		    		})
			    }
			    ])
		    	.transition()
		    	.duration(250)
		    	.call(chart);
		    });

		    //chart.xAxis.tickFormat(d3.format(',f'));
		    //chart.yAxis.tickFormat(d3.format(',.1f'));

		    nv.utils.windowResize(chart.update);

		    chart.multibar.dispatch.on('elementClick', function click(){
		    	//console.log('selected year', obj.point.x);
		    });

		    return chart;
		});
	}

	controller.call(this);
}

module.exports = Course;