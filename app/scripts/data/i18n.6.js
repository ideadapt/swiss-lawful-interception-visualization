function I18n(){
	var self = this;
	self.transformed = null;
	self.store = {};

	this.init = function(locales, lang){
		self.store = locales[lang];
	};

	this.l = function l(key){
		key = key.toUpperCase();
		var value = self.store[key];
		if(value){
			return value;
		}else{
			console.warn('i18n: key not found: ', key);
			return ':'+key;
		}
	};
}

module.exports = I18n;