/*global numeral*/
function index(i18n){
	$('#mainTitle').text(i18n.l('title_txt_maintitle'));
	window.document.title = i18n.l('title_txt_maintitle');

	$('#welcome').append($('<p>').html(i18n.l('longtext_descr_welcome')));
	$('#impressum>h2').html(i18n.l('title_txt_impressum'));
	$('#impressum>p').html(i18n.l('longtext_descr_impressum'));
	$('#slir>h2').html(i18n.l('title_txt_slir'));
	$('#slir>p').html(i18n.l('longtext_descr_slir'));
	$('#slir>a').attr('href', i18n.l('quelle_url_slir'));
	$('#quellen>h2').html(i18n.l('title_txt_quellen'));
	$('#quellen>p').html(i18n.l('longtext_descr_quellen'));
}

function extractLocale(defaultLocale){
	var localeMatch = window.location.search.match(/locale=([a-z]{2})/);
	return localeMatch ? localeMatch[1] : defaultLocale;
}

$(document).ready(function(){
	var bowser = require('bowser');
	require('es6-promise').polyfill();
	require('6to5-polyfill');

	var selectedLocale = extractLocale('de');
	var locales = require('sliv-translations').locales;
	var I18n = require('sliv-i18n');
	var i18n = new I18n(numeral);
	i18n.init(locales, selectedLocale);
	index(i18n);
	window.i18n = i18n; // enable for debugging with i18n.unusedKeys()

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
	var filter = new Filter(dataDivisions, map, i18n);

	var Typ = require('sliv-typ');
	new Typ(dataDivisions, filter, i18n);

	var Straftaten = require('sliv-straftaten');
	new Straftaten(dataDivisions, filter, i18n, bowser);

	var Technologie = require('sliv-technologie');
	new Technologie(dataDivisions, filter, i18n);

	var Delikt = require('sliv-delikt');
	new Delikt(dataDivisions, filter, i18n, bowser);
});