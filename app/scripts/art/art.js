function Art(dataDivisions, filter, CompoundObserver){
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

			var activPromise = dataDivisions.activ(newValues[0], newValues[1]).then(function(activ){
				self.activ = activ;
			});
			var vorratsdatenPromise = dataDivisions.vorratsdaten(newValues[0], newValues[1]).then(function(vorratsdaten){
				self.vorratsdaten = vorratsdaten;
			});
			Promise.all([activPromise, vorratsdatenPromise]).then(function(){
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./art.jade');
		var html = template({activ: self.activ, vorratsdaten: self.vorratsdaten});
		$('#art').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

Art.prototype.activ = function activ(){
	return this.activ;
};
module.exports = Art;