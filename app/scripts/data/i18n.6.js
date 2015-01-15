function I18n(){
	var self = this;
	self.transformed = null;
	self.store = {};

	this.init = function(locales, lang){
		self.store = locales[lang];
	};

	this.l = function l(key){
		key = key.toUpperCase();
		return self.store[key] || ':' + key;
	};
}

module.exports = I18n;