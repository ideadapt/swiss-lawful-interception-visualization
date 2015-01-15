function I18n(){
	var self = this;
	self.transformed = null;
	self.store = {};

	this.init = function(locales, lang){
		self.store = locales[lang];
	};

	this.l = function l(key){
		return self.store[key] || 'KEY NOT FOUND';
	};
}

module.exports = I18n;