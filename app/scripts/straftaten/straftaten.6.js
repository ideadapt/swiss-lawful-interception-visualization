/*global d3*/
function Straftaten(dataDivisions, filter, i18n, bowser, nv){
	var numeral = i18n.numeral;
	var self = this;
	self.view = {};
	self.view.colors = [
		'transparent',  // restliche
		'#131313', //krimorg
		'#24af26', //geldwäsche
		'#F79315', //terror
		'#387FFF', //menschenhandel
		'#FF19D2', //pädokriminalität
		'#132B57', //nachrichtendienst
		'transparent'  // restliche
	];

	function init(){
		$('#straftatenIntro>h3').text(i18n.l('title_txt_schwerestraftaten'));
		$('#straftatenIntro>p').text(i18n.l('schwerestraftaten_descr_descr'));
		return Promise.resolve();
	}

	function totalStraftaten(year, canton){
		var sections = ['drogen', 'gewalt', 'drohung', 'sex', 'oeFrieden', 'staat', 'finanz', 'vermoegen', 'buepf', 'diverse'];
		var promises = sections.map((section) => {
				return dataDivisions[section](year, canton);
			});
		var total = 0;
		return Promise.all(promises).then(function(resolved){
			resolved.forEach(function(value){
				total += value;
			});
			return total;
		});
	}

	function render(){
		var template = require('./straftatenTable.jade');
		var html = template({view: this.view, l: i18n.l});
		$('#straftatenTable').html(html);
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = ['krimorg', 'geldwaesche', 'terror', 'menschenhandel', 'paedo', 'nachrichtendienst'];
			var colors = self.view.colors;
			var total = 0;
			var innerRadiusFactor = 0.5;
			var scaleSliceFactor = 2;
			var promises = sections.map((section) => {
				return dataDivisions[section](year, canton);
			});
			d3.selectAll('#straftaten .nv-legendWrap>text').remove();

			promises.push(totalStraftaten(year, canton));

			Promise.all(promises).then(function(resolved){
				var allStraftatenTotal = resolved.pop();
				self.view.sections = sections;
				self.view.sectionValues = {};
				resolved.forEach(function(value, i){
					var abs = value[0];
					self.view.sectionValues[sections[i]] = {
						value: abs,
						key: i18n.l('schwerestraftaten_txt_'+sections[i]),
						color: colors[i],
						idx: i,
						rgb: ['r', 'g', 'b'].map((v) => { return d3.rgb(colors[i+1])[v]; }).join(', ')
					};
					total += abs;
				});
				render.call(self);

				nv.addGraph(function() {
				    var chart = nv.models.pieChart();
				    chart.pie
					    .startAngle(function(d) { return d.startAngle -Math.PI; })
					    .endAngle(function(d) { return d.endAngle -Math.PI; });
			    	chart.donut(true);
				    var margin = -20;
				    chart.margin({left: margin, right: margin, top: margin, bottom: margin});
				    chart.tooltip.enabled(false);
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
				    		label: i18n.l('schwerestraftaten_txt_'+sections[idx]),
				    		value: resolved[idx][0]*scaleSliceFactor,
				    		percent: resolved[idx][1]
				    	};
					});

					series.splice(0, 0, {
						label: '',
						value: allStraftatenTotal/scaleSliceFactor
					});

					series.push({
						label: '',
						value: allStraftatenTotal/scaleSliceFactor
					});

					d3.select('#straftaten>svg').datum(series)
				    	.transition()
				    	.duration(250)
				    	.call(chart);

			    	var svgWidth = $('#straftaten>svg').width();
           			var svgHeight = $('#straftaten>svg').height();
           			var centerX = svgWidth/2 + 20;
           			var centerY = svgHeight/2 + 20;

				    function thisIsAUprightCanton(){
				    	if(total !== 0){
				    		return;
				    	}
				    	var textUpright = d3.select('#straftaten .nv-legendWrap').append('text');
               			if(bowser.msie){
	       					textUpright.attr('text-anchor', 'middle');
	       				}
	       				textUpright.text(i18n.l('TXT_TXT_KESCHWESTRATA'));
	       				var textWidth = $(textUpright[0]).width();
               			var textX = centerX - textWidth/2;
	       				textUpright.attr('transform', `translate(${textX}, ${centerY-16})`);
				    }

				    function updateLabel(idx){
				    	if(idx === -1){
				    		return;
				    	}
				    	var sliceIdx = +idx+1;
				    	var value = series[sliceIdx].value;
               			var percent = series[sliceIdx].percent.toFixed(1);
               			value = numeral(series[sliceIdx].value/scaleSliceFactor).format();
               			var descrI18nKey = sections[idx] || 'total_straftaten';
               			var descr = i18n.l('schwerestraftaten_descr_'+descrI18nKey);

               			$('#straftatenDescrText').text(descr);
               			$('#straftatenTable td').removeClass('active');
               			$('#straftatenTable tr').eq(idx).find('td:last-child').addClass('active');

               			d3.selectAll('#straftaten .nv-legendWrap>text').remove();

               			if(total === 0){
	               			thisIsAUprightCanton(centerX, centerY);
               			}else{
							var textSelected =d3.select('#straftaten .nv-legendWrap')
	               				.append('text');
		       				if(bowser.msie){
		       					textSelected.attr('text-anchor', 'middle');
		       				}
	               			textSelected.text(`${value} (${percent}%)`);
	               			var textWidth = $(textSelected[0]).width();
	               			var textX = centerX - textWidth/2;
	               			textSelected.attr('transform', `translate(${textX}, ${centerY-16})`);
               			}
				    }

			    	var $slices = $('#straftaten .nv-slice');
			    	var $paths = $slices.find('>path');
				    function updateArc(idx, hover){
				    	var transform = '';
				    	if(hover === true){
				    		transform = 'scale(1.05, 1.05)';
				    	}
			    		var elPath = $paths.get(+idx+1);
			    		d3.select(elPath)
			    			.transition()
               				.duration(250)
               				.attr('transform', transform);

               			updateLabel(idx);
				    }

				    nv.utils.windowResize(() => {chart.update(); });

			    	$('#straftatenTable tr').on('mouseenter', (e)=>{
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
			    		idx = +idx;
			    		updateLabel(idx-1);

			    		// restliche fake slice. do not animate
			    		if(e.currentTarget.__data__.data.label === ''){
			    			[0, series.length-1].forEach((fakeIdx)=>{
					    		d3.select($slices.get(fakeIdx)).classed('hover', false);
					    		var elPath = $paths.get(fakeIdx);
					    		d3.select(elPath)
					    			.transition()
		               				.duration(0)
		               				.attr('transform', '');
			    			});
			    		}
			    	})
			    	.on('mouseleave', (e)=>{
			    		var idx = series.findIndex((serie)=>{return serie.label === e.currentTarget.__data__.data.label;});
			    		updateLabel(+idx-1);
			    	});

			    	thisIsAUprightCanton(centerX, centerY);
			 	});
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);

		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch((err) => {
			console.error(err);
		});
}

module.exports = Straftaten;
