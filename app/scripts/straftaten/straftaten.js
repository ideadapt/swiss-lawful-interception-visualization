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

			Promise.all([
				dataDivisions.terror(newValues[0], newValues[1]),
				dataDivisions.paedo(newValues[0], newValues[1]),
				dataDivisions.krimorg(newValues[0], newValues[1]),
				dataDivisions.terrorProzent(newValues[0], newValues[1]),
				dataDivisions.paedoProzent(newValues[0], newValues[1]),
				dataDivisions.krimorgProzent(newValues[0], newValues[1]),
				dataDivisions.geldwaescheProzent(newValues[0], newValues[1]),
				dataDivisions.nachrichtendienstProzent(newValues[0], newValues[1]),
				dataDivisions.menschenhandelProzent(newValues[0], newValues[1]),
				dataDivisions.geldwaesche(newValues[0], newValues[1]),
				dataDivisions.nachrichtendienst(newValues[0], newValues[1]),
				dataDivisions.menschenhandel(newValues[0], newValues[1])
			]).then(function(resolved){
				self.view.terror = resolved[0];
				self.view.paedo = resolved[1];
				self.view.krimorg = resolved[2];
				self.view.terrorProzent = resolved[3];
				self.view.paedoProzent = resolved[4];
				self.view.krimorgProzent = resolved[5];
				self.view.geldwaescheProzent = resolved[6];
				self.view.nachrichtendienstProzent = resolved[7];
				self.view.menschenhandelProzent = resolved[8];
				self.view.geldwaesche = resolved[9];
				self.view.nachrichtendienst = resolved[10];
				self.view.menschenhandel = resolved[11];
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