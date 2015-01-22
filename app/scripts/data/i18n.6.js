function I18n(){
	var self = this;
	self.transformed = null;
	self.store = {};

	this.init = function(locales, lang, fallbackLang = 'de'){
		self.lang = lang;
		self.fallbackLang = fallbackLang;
		self.store = locales[lang];
		self.fallbackStore = locales[fallbackLang];
	};

	this.l = function l(key){
		key = key.toUpperCase();
		var value = self.store[key];
		if(value){
			return value;
		}else{
			value = self.fallbackStore[key];
			if(value){
				console.warn('i18n,', self.lang, ', missing key: ', key);
				return value;
			}else{
				console.warn('i18n,', self.fallbackLang, ', missing key: ', key);
				return ':'+key;
			}
		}
	};
}

module.exports = I18n;