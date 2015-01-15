
function Filter(dataDivisions, PathObserver, map){
	var self = this;
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
		if(svg.contentDocument.readyState === 'complete'){
			self.svgDoc = svg.contentDocument;
		}
		svg.addEventListener('load', function(){
			self.svgDoc = svg.contentDocument;
		});

		return Promise.all([cantons, years, fakeCantons]);
	}

	function controller(){

		function selectionChanged(year, canton){
			$('#filterText').text(canton + ' ' + year);
		}
		selectionChanged(self.year, self.canton);

		$('#filter years').on('click', 'button', function yearFilterClicked(e){
			self.year = +e.target.value;
			selectionChanged(self.year, self.canton);
			renderYears.call(self);
		});
		$('#filter cantons').on('click', 'button', function cantonFilterClicked(e){
			self.canton = e.target.value;
			$(self.svgDoc).find('#Cantons_default>path').attr('class', '');
			$(self.svgDoc).find('#'+self.canton).attr('class', 'active');
			selectionChanged(self.year, self.canton);
			renderCantons.call(self);
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
		var selectedMapCanton = new PathObserver(map, 'selected');
		selectedMapCanton.open(function(newCanton){
			self.canton = newCanton;
			$(self.svgDoc).find('#Cantons_default>path').attr('class', '');
			$(self.svgDoc).find('#'+self.canton).attr('class', 'active');
			renderCantons.call(self);
		});
	}

	function renderYears(){
		var template = require('./filterYears.jade');
		var html = template({years: this.years, year: self.year});
		$('#filter>years').html(html);
	}

	function renderCantons(){
		var template = require('./filterCantons.jade');
		var html = template({cantons1: this.cantons1, cantons2: this.cantons2, fakeCantons: this.fakeCantons, canton: self.canton});
		$('#filter>cantons').html(html);
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