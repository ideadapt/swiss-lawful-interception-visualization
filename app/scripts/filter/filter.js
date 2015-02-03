/*global Emitter*/
function Filter(dataDivisions, map, i18n){
	var self = this;
	self.emitter = new Emitter();
	self.year = null;
	self.canton = null;
	self.svgDoc = null;

	function init(){
		var years = dataDivisions.years().then(function(years){
			// get a set of years
			self.years = years;
			self.year = Math.max.apply(null, years);
		});
		var cantons = dataDivisions.cantons().then(function(cantons){
			self.cantons1 = cantons.slice(0, 13);
			self.cantons2 = cantons.slice(13);
		});
		var fakeCantons = dataDivisions.fakeCantons().then(function(fakeCantons){
			self.fakeCantons = fakeCantons;
			self.canton = fakeCantons[0]; // CH
		});

		var svg = document.getElementById('svgMap');
		if(!svg.contentDocument){
			console.log('no map');
		}else{
			if(svg.contentDocument.readyState === 'complete'){
				self.svgDoc = svg.contentDocument;
			}
			svg.addEventListener('load', function(){
				self.svgDoc = svg.contentDocument;
			});
		}

		return Promise.all([cantons, years, fakeCantons]);
	}

	function initTooltip(){
		$('[data-toggle="tooltip"]').tooltip({container: 'body'});
	}

	function controller(){

		function selectionChanged(year, canton){
			$('#filterText').text(i18n.l('region_txt_'+canton) + ' ' + year);
			self.emitter.emitSync('selectionChanged', year, canton);
		}
		selectionChanged(self.year, self.canton);

		$('#filter years').on('click', 'button', function yearFilterClicked(e){
			self.year = +e.target.value;
			renderYears.call(self);
			selectionChanged(self.year, self.canton);
		});

		$('#filter cantons').on('click', 'button', function cantonFilterClicked(e){
			self.canton = e.target.value;
			$(self.svgDoc).find('#Cantons_default>path').attr('class', '');
			$(self.svgDoc).find('#'+self.canton).attr('class', 'active');
			renderCantons.call(self);
			selectionChanged(self.year, self.canton);
		});
		$('#filter cantons').on('mouseenter', 'button', function cantonFilterClicked(e){
			var canton = e.target.value;
			$(self.svgDoc).find('#'+canton).attr('class', 'active');
		});
		$('#filter cantons').on('mouseleave', 'button', function cantonFilterClicked(e){
			if(e.target.value === self.canton){
				return;
			}
			var canton = e.target.value;
			$(self.svgDoc).find('#'+canton).attr('class', '');
		});

		$(document).ready(function(){
			var $nav = $('#filter-row>nav');
			var $filter = $('#filter-row');
			var $footer = $('footer');
			var filterRowHeight = $filter.height();
			var heightSet = false;

			$(window).bind('scroll', function() {
				var filterOffsetTop = $filter.offset().top;
				var footerOffsetTop = $footer.offset().top;
				var gradientHeight = 40;
				var filterTopClip = ($(window).scrollTop() > filterOffsetTop);
				var filterBottomClip = ($(window).scrollTop() > footerOffsetTop-filterRowHeight-2*gradientHeight);
				if(filterBottomClip){
					if(!heightSet){
						$filter.height(filterRowHeight);
						heightSet = true;
					}
					$nav.addClass('goToTop');
					$nav.css('top', -1*($(window).scrollTop() - footerOffsetTop +filterRowHeight+2*gradientHeight));
				} else if(filterTopClip){
					if(!heightSet){
						$filter.height(filterRowHeight);
						heightSet = true;
					}
					$nav.css('top', 0);
					$nav.addClass('goToTop');
				}else{
					$nav.removeClass('goToTop');
				}
			});
		});

		function mapSelectionChanged(newCanton){
			self.canton = newCanton;
			$(self.svgDoc).find('#Cantons_default>path').attr('class', '');
			$(self.svgDoc).find('#'+self.canton).attr('class', 'active');
			renderCantons.call(self);
			selectionChanged(self.year, self.canton);
		}
		map.emitter.on('selectionChanged', mapSelectionChanged);
	}

	function renderYears(){
		var template = require('./filterYears.jade');
		var html = template({years: this.years, year: self.year});
		$('#filter>years').html(html);
	}

	function renderCantons(){
		$('#filter>cantons [data-toggle="tooltip"]').tooltip('destroy');
		var template = require('./filterCantons.jade');
		var html = template({cantons1: this.cantons1, cantons2: this.cantons2, fakeCantons: this.fakeCantons, canton: self.canton, l: i18n.l});
		$('#filter>cantons').html(html);
		initTooltip();
	}

	function render(){
		renderYears.call(this);
		renderCantons.call(this);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this));
}

Filter.prototype.year = function year(){
	return this.year;
};
module.exports = Filter;