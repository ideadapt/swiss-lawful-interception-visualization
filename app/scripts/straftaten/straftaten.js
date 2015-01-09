function Straftaten(dataDivisions, filter, CompoundObserver){
	var self = this;
	self.view = {};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var observer = new CompoundObserver();
		observer.addPath(filter, 'year');
		observer.addPath(filter, 'canton');
		observer.open(function(newValues){

			var year = newValues[0];
			var canton = newValues[1];
			var keys = ['terror', 'paedo', 'krimorg', 'menschenhandel', 'nachrichtendienst', 'geldwaesche'];
			keys.forEach(function(key){
				keys.push(key+'Prozent');
			});
			var promises = keys.map(function(key){
				return dataDivisions[key](year, canton);
			});

			Promise.all(promises).then(function(resolved){
				resolved.forEach(function(value, i){
					self.view[keys[i]] = value;
				});
				self.view.total = 0;
				self.view.total = Object.keys(self.view).reduce(function(sum, key){
					return sum + self.view[key];
				}, self.view.total);
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./straftaten.jade');
		var html = template(this.view);
		$('#straftaten').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

module.exports = Straftaten;