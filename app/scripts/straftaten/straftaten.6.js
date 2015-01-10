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
			var [year, canton]  = newValues;
			var sections = ['terror', 'paedo', 'krimorg', 'nachrichtendienst', 'geldwaesche', 'menschenhandel'];
			var promises = sections.map(function(section){
				return dataDivisions[section](year, canton);
			});

			Promise.all(promises).then(function(resolved){
				self.view.sections = sections;
				self.view.sectionValues = {};
				resolved.forEach(function(value, i){
					self.view.sectionValues[sections[i]] = {
						number: value[0],
						prozent: value[1],
						key: sections[i]
					};
				});
				self.view.total = sections.reduce((sum, section) => {
					return sum + self.view.sectionValues[section].number;
				}, 0);
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./straftaten.jade');
		var html = template({view: this.view});
		$('#straftaten').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Straftaten;