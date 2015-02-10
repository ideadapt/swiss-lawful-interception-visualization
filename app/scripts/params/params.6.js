function Params(_location){
	var self = this;
	self.location = _location;

	self.init = function init(defaultLocale){
		// domain.x/#lang/#year/#canton
	    // de
	    // de/2014
	    // de/2014/gr
	    // 2014
	    // 2014/gr
		var path = self.location.pathname;
		var regex = /^\/([a-z]{2}\/?)?(\d{4}\/?)?(\/[a-z]{2}\/?)?$/;
		var matches = path.match(regex);
		var locale, year, canton;
		locale = matches[1];
		locale = locale ? locale.replace(/\//g, '') : defaultLocale;
		year = matches[2];
		year = year ? +year.replace(/\//g, '') : undefined;
		canton = matches[3];
		canton = canton ? canton.replace(/\//g, '').toLowerCase() : undefined;
		self.year = year;
		self.canton = canton;
		self.locale = locale;
	};

	self.setYear = function setYear(year){
		// TODO pushstate
		self.year = year;
	};

	self.setCanton = function setCanton(canton){
		self.canton = canton;
	};
}

module.exports = Params;