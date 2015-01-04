
function Filter(data){
	var self = this;
	self.year = null;
	self.canton = null;

	function init(){
		var years = data.years().then(function(years){
			// get a set of years
			self.years = years;
			self.year = Math.max(years);
		});
		var cantons = data.cantons().then(function(cantons){
			self.cantons = cantons;
		});
		var fakeCantons = data.fakeCantons().then(function(fakeCantons){
			self.fakeCantons = fakeCantons;
			self.canton = fakeCantons[0]; // CH
		});

		return Promise.all([cantons, years, fakeCantons]);
	}

	function controller(){
		$('#filter years').on('click', 'button', function yearFilterClicked(e){
			self.year = e.target.value;
			renderYears.call(self);
		});
		$('#filter cantons').on('click', 'button', function cantonFilterClicked(e){
			self.canton = e.target.value;
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
		var html = template({cantons: this.cantons, fakeCantons: this.fakeCantons, canton: self.canton});
		$('#filter>cantons').html(html);
	}

	function render(){
		renderYears.call(this);
		renderCantons.call(this);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

Filter.prototype.year = function year(){
	return this.year;
};
module.exports = Filter;