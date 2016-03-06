$(document).ready(function(){
	var bowser = require('bowser');
	var Papa = require('papaparse');
	var numeral = require('numeral');
	var Emitter = require('emitter').EventEmitter;
	var Raphael = require('raphael');
	var nv = require('nvd3');
	require('es6-promise').polyfill();
	require('babel-polyfill');
	var Params = require('sliv-params');
	var params = new Params(Emitter, window.location, window);
	params.init('de');

	var selectedLocale = params.locale;
	var locales = require('sliv-translations').locales;
	var I18n = require('sliv-i18n');
	var i18n = new I18n(numeral);
	i18n.init(locales, selectedLocale);

	var Index = require('sliv-index');
	new Index(i18n, window, window.document);
	// window.i18n = i18n; // enable to debug with i18n.unusedKeys()

	var DataDivisions = require('sliv-data-divisions');
	var DataSummary = require('sliv-data-summary')
	var dataDivisions = new DataDivisions(Papa);
	var dataSummary = new DataSummary(Papa);

	// somehow!!! require('./tooltip.jade') does not work form inside course.js ...
	var legendTemplate = require('../../app/scripts/course/legend.jade');
	var Course = require('sliv-course');
	new Course(dataSummary, legendTemplate, i18n, nv);

	var Map = require('sliv-map');
	var map = new Map(Emitter);
	$(window).load(function(){
		map.init();
	});

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, map, i18n, params, Emitter);

	var Typ = require('sliv-typ');
	new Typ(dataDivisions, filter, i18n);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter, i18n, bowser, nv);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter, i18n, Raphael);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter, i18n, bowser, nv);

	var Tracker = require('sliv-tracker');
	new Tracker(params);
});