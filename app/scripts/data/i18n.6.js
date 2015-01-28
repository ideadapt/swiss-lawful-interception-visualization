function I18n(numeral){
	var self = this;
	var numeralOrg = numeral;
	self.transformed = null;
	self.store = {};

	this.init = function(locales, lang, fallbackLang = 'de'){
		self.lang = lang;
		self.fallbackLang = fallbackLang;
		self.store = locales[lang];
		self.fallbackStore = locales[fallbackLang];

		['rm', 'de', 'fr', 'it', 'en'].forEach(function(lang){
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
			// numeral.zeroFormat('');
			// i18n.l('txt_txt_no_value') does not work. should have NaN Format and zeroFormat
			// => using own numeralDecorator for now
		});
		numeral.language(lang);
	};

	this.l = function l(key){
		key = key.toUpperCase();
		var value = self.store[key];
		if(typeof value === 'string'){
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

	this.numeral = function numeralDecorator(toFormat){
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