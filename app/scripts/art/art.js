function Art(dataDivisions, filter, CompoundObserver){
	var self = this;

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var observer = new CompoundObserver();
		observer.addPath(filter, 'year');
		observer.addPath(filter, 'canton');
		observer.open(function(newValues){

			Promise.all([
				// 'post', 'internet', 'telefon', 'notsuche'
				dataDivisions.post(newValues[0], newValues[1]),
				dataDivisions.internet(newValues[0], newValues[1]),
				dataDivisions.telefon(newValues[0], newValues[1]),
				dataDivisions.notsuche(newValues[0], newValues[1])
			]).then(function(resolved){
				self.post = resolved[0];
				self.internet = resolved[1];
				self.telefon = resolved[2];
				self.notsuche = resolved[3];
				self.total = self.post + self.internet + self.telefon + self.notsuche;
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./art.jade');
		var html = template(self);
		$('#art').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

module.exports = Art;