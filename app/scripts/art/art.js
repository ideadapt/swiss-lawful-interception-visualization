function Art(dataDivisions, filter){
	var self = this;
	self.view = {
		total: '',
		keyValues: []
	};

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function selectionChanged(year, canton){
			var keys = ['post', 'internet', 'telefon', 'notsuche'];
			self.view.keys = keys;
			var promises = keys.map(function(key){
				return dataDivisions[key](year, canton);
			});
		    Promise.all(promises).then(function(resolved){
		    	var total = 0;
		    	self.view.keyValues = [];
		    	keys.forEach(function(key, idx){
		    		self.view.keyValues.push({
		    			i18n: window.i18n.l('ART_TXT_'+ keys[idx]),
		    			value: resolved[idx]
		    		});

		    		total += resolved[idx];
		    	});
		    	self.view.total = {
	    			i18n: window.i18n.l('total'),
	    			value: total
	    		};
				render.call(self);
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);
	}

	function render(){
		var template = require('./art.jade');
		var html = template({view: self.view});
		$('#art').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch(function(err){
			console.log(err);
		});
}

module.exports = Art;