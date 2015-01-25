/*global nv, d3, numeral, bowser*/
function Delikt(dataDivisions, filter){
	var self = this;
	self.view = {};
	self.view.colors = [
		'#282828', // drogen
		'#FE0405', // gewalt
		'#109618', // drohung
		'#B2FF66', // sex
		'#9C14DB', // oeFrieden
		'#FF6767', // staat
		'#668CD9', // finanz
		'#C2943E', // vermoegen
		'#86BAFA', // buepf
		'#BEC3BE',  // diverse
	];

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = [
			 'drogen',
			 'gewalt',
			 'drohung',
			 'sex',
			 'oeFrieden',
			 'staat',
			 'finanz',
			 'vermoegen',
			 'buepf',
			 'diverse'
			];
			var colors = self.view.colors;
			var total = 0;
			var innerRadiusFactor = 0.5;
			var promises = sections.map((section) => {
				return dataDivisions[section](year, canton);
			});
			d3.selectAll('#delikt .nv-legendWrap>text').remove();

			Promise.all(promises).then(function(resolved){
				self.view.sections = sections;
				self.view.sectionValues = {};
				resolved.forEach(function(value, i){
					self.view.sectionValues[sections[i]] = {
						value: value,
						key: window.i18n.l('deliktegruppe_txt_'+sections[i]),
						color: colors[i],
						idx: i,
						rgb: ['r', 'g', 'b'].map((v) => { return d3.rgb(colors[i])[v]; }).join(', ')
					};
					total += value;
				});
				render.call(self);

				nv.addGraph(function() {
				    var chart = nv.models.pieChart();
			    	chart.donut(true);
				    var margin = -40;
				    chart.margin({left: margin, right: margin, top: margin, bottom: margin});
				    chart.tooltips(false);
				    chart.showLabels(false);
				    chart.showLegend(false);
				    chart.donutRatio(innerRadiusFactor);
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

				    function updateLabel(idx){
				    	var value = series[idx].value;
               			var percent = (value/(total/100)).toFixed(2);
               			value = numeral(series[idx].value).format();
               			var descr = window.i18n.l('deliktegruppe_descr_'+sections[idx]);

               			$('#deliktDescr').text(descr);
               			$('#deliktTable td').removeClass('active');
               			$('#deliktTable tr').eq(idx).find('td:last-child').addClass('active');

				    	var svgWidth = $('#delikt>svg').width();
               			var svgHeight = $('#delikt>svg').height();
               			var centerX = svgWidth/2 - 20;
               			var centerY = svgHeight/2 - 10;
               			d3.selectAll('#delikt .nv-legendWrap>text:nth-of-type(2)').remove();

						var textSelected =d3.select('#delikt .nv-legendWrap')
               				.append('text');
	       				if(bowser.browser.msie || bowser.browser.gecko){
	       					textSelected.attr('text-anchor', 'middle');
	       				}
               			textSelected.text(`${value} (${percent}%)`);
               			var textWidth = $(textSelected[0]).width();
               			var textX = centerX - textWidth/2;
               			textSelected.attr('transform', `translate(${textX}, ${centerY+8})`);
				    }

			    	var $slices = $('#delikt .nv-slice');
			    	var $paths = $slices.find('>path');
				    function updateArc(idx, hover){
				    	var translate = '';
				    	if(hover === true){
				    		translate = 'scale(1.05, 1.05)';
				    	}
			    		var elPath = $paths.get(idx);
			    		d3.select(elPath)
			    			.transition()
               				.duration(250)
               				.attr('transform', translate);

               			updateLabel(idx);
				    }

				    var svgWidth = $('#delikt>svg').width();
               			var svgHeight = $('#delikt>svg').height();
               			var centerX = svgWidth/2 - 20;
               			var centerY = svgHeight/2 - 10;

					var textTotal =d3.select('#delikt .nv-legendWrap')
           				.append('text');
       				if(bowser.browser.msie || bowser.browser.gecko){
       					textTotal.attr('text-anchor', 'middle');
       				}
       				textTotal.text(`Total ${numeral(total).format()}`);
           			var textWidth = $(textTotal[0]).width();
           			var textX = centerX - textWidth/2;
           			textTotal.attr('transform', `translate(${textX}, ${centerY-16})`);

				    nv.utils.windowResize(() => {chart.update(); });

			    	$('#deliktTable tr').on('mouseenter', (e)=>{
			    		var idx = e.currentTarget.attributes['data-idx'].value;
			    		updateLabel(idx);
			    		updateArc(idx, true);
			    	})
			    	.on('mouseleave', (e)=>{
			    		var idx = e.currentTarget.attributes['data-idx'].value;
			    		updateArc(idx, false);
			    	});

			    	$slices.on('mouseenter', (e)=>{
			    		var idx = series.findIndex((serie)=>{return serie.label === e.currentTarget.__data__.data.label;});
			    		updateLabel(idx);
			    	})
			    	.on('mouseleave', (e)=>{
			    		var idx = series.findIndex((serie)=>{return serie.label === e.currentTarget.__data__.data.label;});
			    		updateLabel(idx);
			    	});
			 	});
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);

		return Promise.resolve();
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