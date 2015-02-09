function Params(_location){
	var self = this;
	self.location = _location;

	self.init = function init(defaultLocale){
		// domain.x/dist/#lang/#year/#canton
	    // de
	    // de/2014
	    // de/2014/gr
	    // 2014
	    // 2014/gr
		var path = self.location.pathname;
		var regex = /^\/(dist\/)?([a-z]{2}\/)?(\d{4}\/?)?(\/[a-z]{2}\/?)?$/;
		var matches = path.match(regex);
		var locale, year, canton;
		locale = matches[2];
		locale = locale ? locale.replace('/', '') : defaultLocale;
		year = matches[3];
		year = year ? +year.replace('/', '') : undefined;
		canton = matches[4];
		canton = canton ? canton.replace('/', '').toLowerCase() : undefined;
		self.year = year;
		self.canton = canton;
		self.locale = locale;
	};

	self.setYear = function setYear(year){
		console.log('year changed', self.year, year);
		self.year = year;
	};

	self.setCanton = function setCanton(canton){
		console.log('canton changed', self.canton, canton);
		self.canton = canton;
	};
}

module.exports = Params;