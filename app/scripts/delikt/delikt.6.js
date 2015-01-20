/*global nv, d3, numeral*/
function Delikt(dataDivisions, filter){
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
		'#C2943E',
		'#86BAFA',
		'#BEC3BE'];

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = ['drogen', 'drohung', 'finanz', 'gewalt', 'sex', 'oeFrieden', 'staat', 'vermoegen', 'buepf', 'diverse'];
			var colors = self.view.colors;
			var total = 0;
			var innerRadiusFactor = 0.5;
			var promises = sections.map((section) => {
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
						idx: i,
						rgb: ['r', 'g', 'b'].map((v) => { return d3.rgb(colors[i])[v]; }).join(', ')
					};
					total += value;
				});
				render.call(self);

				nv.addGraph(function() {
					var [width, height ] = [450, 450];
				    var chart = nv.models.pieChart();
			    	chart.donut(true);
				    chart.height(450);
				    chart.width(450);
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
				    	var label = series[idx].label;
				    	var value = series[idx].value;
               			var percent = (value/(total/100)).toPrecision(2);
               			value = numeral(series[idx].value).format();
				    	var svgWidth = $('#delikt>svg').width();
               			var svgHeight = $('#delikt>svg').height();
               			var centerX = svgWidth/2 - 20;
               			var centerY = svgHeight/2 - 10;
               			d3.selectAll('#delikt .nv-legendWrap>text').remove();

               			var text =d3.select('#delikt .nv-legendWrap')
               				.append('text')
               				.text(label);
               			var textWidth = $(text[0]).width();
               			var textX = centerX - textWidth/2;
               			text.attr('transform', `translate(${textX}, ${centerY})`);

						text =d3.select('#delikt .nv-legendWrap')
               				.append('text')
               				.text(`${value} (${percent}%)`);
               			textWidth = $(text[0]).width();
               			textX = centerX - textWidth/2;
               			text.attr('transform', `translate(${textX}, ${centerY+16})`);
				    }

			    	var $slices = $('#delikt .nv-slice');
			    	var $paths = $slices.find('>path');
				    function updateArc(hover, element){
				    	var outerRadiusExtra = 0;
				    	var innerRadiusFactorEff = innerRadiusFactor;
				    	if(hover === true){
				    		innerRadiusFactorEff = innerRadiusFactorEff - 0.05;
				    		outerRadiusExtra = 5;
				    	}
				    	var idx = $(element).data('idx');
			    		var el = $slices.get(idx);
			    		var elPath = $paths.get(idx);
			    		d3.select(el).classed('hover', hover);

						var availableWidth = width -50;
						var availableHeight = height-50;
						var radius = Math.min(availableWidth, availableHeight) / 2;
						var arcRadius = radius-(radius / 5);

			    		var arcOver = d3.svg.arc().outerRadius(arcRadius+outerRadiusExtra).innerRadius(radius * innerRadiusFactorEff);
			    		d3.select(elPath)
			    			.transition()
               				.duration(250)
               				.attr('d', arcOver);

               			updateLabel(idx);
				    }

			    	nv.utils.windowResize(chart.update);

			    	$('#deliktTable tr').on('mouseenter', (e)=>{
			    		updateArc(true, e.currentTarget);
			    	})
			    	.on('mouseleave', (e)=>{
			    		updateArc(false, e.currentTarget);
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