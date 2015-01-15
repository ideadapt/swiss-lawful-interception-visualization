/*global CompoundObserver,PathObserver, numeral*/
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

	require('es6-promise').polyfill();
	var dataDivisions = require('sliv-data-divisions');
	var dataSummary = require('sliv-data-summary');

	// somehow!!! require('./tooltip.jade') does not work form inside course.js ...
	var tooltipTemplate = require('../../app/scripts/course/tooltip.jade');
	var Course = require('sliv-course');
	new Course(dataSummary, tooltipTemplate);

	var Map = require('sliv-map');
	var map = new Map();

	var i18n = require('sliv-i18n');
	window.i18n = i18n;

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, PathObserver, map);

	var Art = require('sliv-art');
	new Art(dataDivisions, filter, CompoundObserver);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter, CompoundObserver);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter, CompoundObserver);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter, CompoundObserver);
});