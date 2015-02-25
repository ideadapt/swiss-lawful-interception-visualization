function Typ(dataDivisions, filter, i18n){
	var numeral = i18n.numeral;
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
			var keys = ['aktiv', 'vds', 'techadm', 'telefonbuch', 'kanton'];
			self.view.keys = keys;
			var promises = keys.map(function(key){
				return dataDivisions[key](year, canton);
			});
		    Promise.all(promises).then(function(resolved){
		    	var total = 0;
		    	self.view.keyValues = [];
		    	keys.forEach(function(key, idx){
		    		self.view.keyValues.push({
		    			i18n: i18n.l('typ_txt_'+ keys[idx]),
		    			typ: keys[idx],
		    			value: numeral(resolved[idx]).format()
		    		});

		    		if(!Number.isNaN(resolved[idx])){
		    			total += resolved[idx];
		    		}
		    	});
		    	self.view.total = {
	    			i18n: i18n.l('txt_txt_total'),
	    			value: numeral(total).format()
	    		};
				render.call(self);
			});
		}
		filter.emitter.on('selectionChanged', selectionChanged);
	}

	function render(){
		var template = require('./typ.jade');
		var html = template({view: self.view, l: i18n.l});
		$('#typ').html(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(controller.bind(this))
		.then(render.bind(this))
		.catch(function(err){
			console.log(err);
		});
}

module.exports = Typ;