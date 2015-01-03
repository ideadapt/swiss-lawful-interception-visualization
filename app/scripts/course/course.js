/*global nv, d3*/
$(window).load(function(){
	//var self = this;
	this.interface = {
		selected: null
	};

	this.controller = function controller(){
		var data = require('sliv-data');
		data.all().then(function (data){
			console.log('got data from service', data);

			nv.addGraph(function() {
			    var chart = nv.models.multiBarChart();

			    //chart.xAxis.tickFormat(d3.format(',f'));

			    //chart.yAxis.tickFormat(d3.format(',.1f'));

			    chart.multibar.stacked(true); // default to stacked
			    chart.showControls(false); // don't show controls

			    d3.select('#course>svg').datum([{
			    	key: 'Aktiv',
			    	values: [
			    		{
			    			x: '2012', y: 10
			    		},
			    		{
			    			x: '2013', y: 30
			    		}
			    	]
			    },{
			    	key: 'Passiv',
			    	values: [
			    		{
			    			x: '2012', y: 6
			    		},
			    		{
			    			x: '2013', y: 40
			    		}
			    	]
			    }
			    ])
			    	.transition()
			    	.duration(250)
			    	.call(chart);

			    nv.utils.windowResize(chart.update);

			    chart.multibar.dispatch.on('elementClick', function click(obj){
			    	console.log('selected year', obj.point.x);
			    });

			    return chart;
			});
		});
	};

	window.year = this.interface;
	this.controller();
});