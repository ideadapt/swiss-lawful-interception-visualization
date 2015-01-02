(function(){
	function Filter(){
		var self = this;
		var data = require('sliv-data');
		this.init = function init(){
			data.all().then(function(){
				// get all years
				self.years = ['2012'];
			});
		};

		this.controller = function controller(){

		};

		this.render = function render(){
			// hmmm??
		};

		this.init();

		return {
			years: this.years
		};
	}

	window.filter = new Filter();
})();