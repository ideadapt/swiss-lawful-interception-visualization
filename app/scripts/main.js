/*global numeral*/
function extractParams(defaultLocale){
	// domain.x/dist/#lang/#year/#canton
    // de
    // de/2014
    // de/2014/gr
    // 2014
    // 2014/gr
	var path = window.location.pathname;
	var regex = /^\/(dist\/)?([a-z]{2}\/)?(\d{4}\/?)?(\/[a-z]{2}\/?)?$/;
	var matches = path.match(regex);
	var locale, year, canton;
	locale = matches[2];
	locale = locale ? locale.replace('/', '') : defaultLocale;
	year = +matches[3].replace('/', '');
	canton = matches[4];
	canton = canton ? canton.replace('/', '').toLowerCase() : undefined;
	return {locale: locale, year: year, canton: canton};
}

$(document).ready(function(){
	var bowser = require('bowser');
	require('es6-promise').polyfill();
	require('6to5-polyfill');

	var params = extractParams('de');

	var selectedLocale = params.locale;
	var locales = require('sliv-translations').locales;
	var I18n = require('sliv-i18n');
	var i18n = new I18n(numeral);
	i18n.init(locales, selectedLocale);
	var Index = require('sliv-index');
	new Index(i18n);
	window.i18n = i18n; // enable to debug with i18n.unusedKeys()

	var dataDivisions = require('sliv-data-divisions');
	var dataSummary = require('sliv-data-summary');

	// somehow!!! require('./tooltip.jade') does not work form inside course.js ...
	var legendTemplate = require('../../app/scripts/course/legend.jade');
	var Course = require('sliv-course');
	new Course(dataSummary, legendTemplate, i18n);

	var Map = require('sliv-map');
	var map = new Map();
	$(window).load(function(){
		map.init();
	});

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, map, i18n, params.year, params.canton);

	var Typ = require('sliv-typ');
	new Typ(dataDivisions, filter, i18n);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter, i18n, bowser);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter, i18n);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter, i18n, bowser);
});