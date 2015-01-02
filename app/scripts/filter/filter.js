
function Filter(data){
	var self = this;

	function unique(arr){
		return arr.filter(function (e, i, arr) {
		    return arr.lastIndexOf(e) === i;
		});
	}

	function init(){
		return data.all().then(function(data){
			// get a set of years
			var years = unique(data.map(function(d){return d.year;})).sort();
			self.years = years;
		});
	}

	function controller(){
		$('#filter').on('click', 'li', function yearFilterClicked(){
			console.log('yearFilterClicked', arguments);
		});
	}

	function render(){
		var template = require('./filter.jade');
		var html = template({years: this.years});
		$('#filter').prepend(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

Filter.prototype.years = function years(){
	return this.years;
};
module.exports = Filter;