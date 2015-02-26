function I18n(numeral){
	var self = this;
	var numeralOrg = numeral;
	self.transformed = null;
	self.store = {};
	self.foundKeys = [];
	self.languages = ['de', 'fr', 'it', 'rm', 'en'];

	this.init = function(locales, lang, fallbackLang = 'de'){
		self.lang = lang;
		self.fallbackLang = fallbackLang;
		self.store = locales[lang];
		self.fallbackStore = locales[fallbackLang];

		self.languages.forEach(function(lang){
			numeral.language(lang, {
			    delimiters: {
			        thousands: '\'',
			        decimal: ','
			    },
			    abbreviations: {
			        thousand: 'k',
			        million: 'Mio',
			        billion: 'Mrd',
			        trillion: 't'
			    },
			    ordinal : function (number) {
			        return number === 1 ? 'e' : 'e';
			    },
			    currency: {
			        symbol: 'CHF'
			    }
			});
			numeral.defaultFormat('0,0');
		});
		numeral.language(lang);
	};

	this.l = function l(key, defaultValue){
		key = key.toUpperCase();
		var value = self.store[key];
		if(typeof value === 'string'){
			self.foundKeys.push(key);
			return value;
		}else{
			value = self.fallbackStore[key];
			if(value){
				console.warn('i18n,', self.lang, ', missing key: ', key);
				self.foundKeys.push(key);
				return value;
			}else{
				console.warn('i18n,', self.fallbackLang, ', missing key: ', key);
				return defaultValue !== undefined ? defaultValue : ':'+key;
			}
		}
	};

	this.unusedKeys = function unusedKeys(){
		var allKeys = Object.keys(self.store);
		var diffKeys = allKeys.filter(k => {
			return self.foundKeys.indexOf(k) === -1;
		});
		return diffKeys;
	};

	this.numeral = function numeralDecorator(toFormat){
		// numeral.zeroFormat('');
		// i18n.l('txt_txt_no_value') does not work. should have NaN Format and zeroFormat
		// => using own numeralDecorator for now
		if(Number.isNaN(toFormat)){
			return {
				format: function format(){
					return self.l('txt_txt_no_value');
				}
			};
		}else{
			return numeralOrg(toFormat);
		}
	};
}

module.exports = I18n;