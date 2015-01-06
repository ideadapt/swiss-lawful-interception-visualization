function Straftaten(dataDivisions, filter, CompoundObserver){
	var self = this;
	self.activ = null;

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var observer = new CompoundObserver();
		observer.addPath(filter, 'year');
		observer.addPath(filter, 'canton');
		observer.open(function(newValues){

			Promise.all([
				dataDivisions.terror(newValues[0], newValues[1]),
				dataDivisions.paedo(newValues[0], newValues[1]),
				dataDivisions.krimorg(newValues[0], newValues[1])
			]).then(function(resolved){
				self.terror = resolved[0];
				self.paedo = resolved[1];
				self.krimorg = resolved[2];
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./straftaten.jade');
		var html = template({terror: self.terror, paedo: self.paedo, krimorg: self.krimorg});
		$('#straftaten').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

module.exports = Straftaten;