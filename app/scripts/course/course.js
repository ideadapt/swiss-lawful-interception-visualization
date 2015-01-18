/*global nv, d3, numeral*/
function Course(dataSummary, legendTemplate){
	var self = this;
	self.view = {};

	function controller(){

		nv.addGraph(function() {
		    var chart = nv.models.multiBarChart();
		    	chart.multibar.stacked(true);
		    	chart.showControls(false)
		    	.showLegend(false)
			    .height(300)
				.tooltips(false)
			    .reduceXTicks(false)
			    .color(['#FE0405', '#9BBB59', '#668CD9']);

			var keys = ['aktiv', 'vds', 'techadm', 'telefonbuch'];
			var promises = keys.map(function(key){
				return dataSummary[key]();
			});
		    Promise.all(promises).then(function(resolved){

		    	var aktiv = resolved[0];
		    	var vds = resolved[1];
		    	var tech = resolved[2];
		    	var tel = resolved[3];
		    	var tooltip = {};

		       	function selectionChanged(e){
		       		$('#legend_typ_telefonbuch').text(numeral(tooltip[e.point.x].Tel).format());
		       		$('#legend_typ_aktiv').text(numeral(tooltip[e.point.x].Aktiv).format());
		       		$('#legend_typ_vds').text(numeral(tooltip[e.point.x].VDS).format());
		       		$('#legend_typ_techadm').text(numeral(tooltip[e.point.x].TechAdm).format());
		       	}
		       	chart.multibar.dispatch.on('elementClick', selectionChanged);
		       	chart.multibar.dispatch.on('elementMouseover', selectionChanged);

		       	tel.map(function(r){
	    			tooltip[r.year] = tooltip[r.year] || {};
		    		tooltip[r.year].Tel = r.value;
	    		});

			    d3.select('#course>svg').datum([{
			    	key: window.i18n.l('TYP_TXT_AKTIV'),
			    	values: aktiv.map(function(r){
			    		tooltip[r.year] = tooltip[r.year] || {};
			    		tooltip[r.year].Aktiv = r.value;
		    			return {x: r.year, y: r.value};
		    		})
			    },{
			    	key: window.i18n.l('TYP_TXT_VDS'),
			    	values: vds.map(function(r){
			    		tooltip[r.year] = tooltip[r.year] || {};
			    		tooltip[r.year].VDS = r.value;
		    			return {x: r.year, y: r.value};
		    		})
			    },
			    {
			    	key: window.i18n.l('TYP_TXT_TECHADM'),
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

		       	selectionChanged({point: {x: aktiv[aktiv.length-1].year }});
		    });

		    chart.yAxis.tickFormat(function(n){
		    	return numeral(n).format();
		    });
		    chart.yAxis.axisLabel('Anzahl Gesuche');


		    nv.utils.windowResize(chart.update);

		    return chart;
		});

		self.view = {
			l: window.i18n.l
		};

		return Promise.resolve();
	}

	function render(){
		var html = legendTemplate({l: this.view.l});
		$('#course-legend').html(html);
		return Promise.resolve();
	}

	controller.call(this)
		.then(render.bind(this))
		.catch(function(err){
			console.log(err);
		});
}

module.exports = Course;