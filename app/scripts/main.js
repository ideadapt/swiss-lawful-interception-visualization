/*global numeral*/
function index(i18n){

	$('#mainTitle').text(i18n.l('title_txt_maintitle'));
	window.document.title = i18n.l('title_txt_maintitle');

	$('#welcome').append($('<p>').html(i18n.l('longtext_descr_welcome')));
	$('#impressum>h2').html(i18n.l('title_txt_impressum'));
	$('#impressum>p').html(i18n.l('longtext_descr_impressum'));
	$('#slir>h2').html(i18n.l('title_txt_slir'));
	$('#slir>p').html(i18n.l('longtext_descr_slir'));
	$('#quellen>h2').html(i18n.l('title_txt_quellen'));
	$('#quellen>p').html(i18n.l('longtext_descr_quellen'));
}

$(document).ready(function(){
	var numeralOrg = numeral;
	function numeralDecorator(toFormat){
		if(Number.isNaN(toFormat)){
			return {
				format: function format(){
					return window.i18n.l('txt_txt_no_value');
				}
			};
		}else{
			return numeralOrg(toFormat);
		}
	}
	var defaultLocale = 'de';
	var localeMatch = window.location.search.match(/locale=([a-z]{2})/);
	var selectedLocale = localeMatch ? localeMatch[1] : defaultLocale;
	var locales = require('sliv-translations').locales;
	var I18n = require('sliv-i18n');
	var i18n = new I18n();
	i18n.init(locales, selectedLocale);
	window.i18n = i18n;

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
	numeral.language(selectedLocale);

	window.bowser = require('bowser');
	require('es6-promise').polyfill();
	require('6to5-polyfill');

	index(i18n);

	var dataDivisions = require('sliv-data-divisions');
	var dataSummary = require('sliv-data-summary');

	// somehow!!! require('./tooltip.jade') does not work form inside course.js ...
	var legendTemplate = require('../../app/scripts/course/legend.jade');
	var Course = require('sliv-course');
	new Course(dataSummary, legendTemplate, numeralDecorator);

	var Map = require('sliv-map');
	var map = new Map();
	$(window).load(function(){
		map.init();
	});

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, map);

	var Typ = require('sliv-typ');
	new Typ(dataDivisions, filter, numeralDecorator);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter, numeralDecorator);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter, numeralDecorator);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter, numeralDecorator);
});