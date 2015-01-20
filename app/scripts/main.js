/*global numeral*/
$(document).ready(function(){

	numeral.language('de', {
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
	numeral.language('de');
	numeral.defaultFormat('0,0');
	numeral.zeroFormat('');

	require('es6-promise').polyfill();
	require('6to5-polyfill');

	var locales = require('sliv-translations').locales;
	var I18n = require('sliv-i18n');
	var i18n = new I18n();
	i18n.init(locales, 'de');
	window.i18n = i18n;

	var dataDivisions = require('sliv-data-divisions');
	var dataSummary = require('sliv-data-summary');

	// somehow!!! require('./tooltip.jade') does not work form inside course.js ...
	var legendTemplate = require('../../app/scripts/course/legend.jade');
	var Course = require('sliv-course');
	new Course(dataSummary, legendTemplate);

	var Map = require('sliv-map');
	var map = new Map();

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, map);

	var Art = require('sliv-art');
	new Art(dataDivisions, filter);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter);

});