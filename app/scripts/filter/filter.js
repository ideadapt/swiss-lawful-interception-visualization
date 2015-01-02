(function(){
	function Filter(){
		var self = this;
		this.init = function init(){
			window.data.all().then(function(){
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