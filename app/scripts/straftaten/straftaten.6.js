function Straftaten(dataDivisions, filter){
	var self = this;
	self.template = require('./straftaten.jade');
	self.view = {};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var sections = ['krimorg', 'terror', 'geldwaesche', 'menschenhandel', 'paedo', 'nachrichtendienst'];
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
						key: window.i18n.l('schwerestraftaten_txt_'+sections[i])
					};
				});
				render.call(self);
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);
	}

	function render(){
		var template = require('./straftaten.jade');
		var html = template({view: this.view});
		$('#straftaten').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch((err) => {
			console.error(err.message);
		});
}

module.exports = Straftaten;