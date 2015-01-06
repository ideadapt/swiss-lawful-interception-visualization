/*global CompoundObserver,PathObserver*/
$(document).ready(function(){
	require('es6-promise').polyfill();
	var dataDivisions = require('sliv-data-divisions');
	dataDivisions.init();
	var dataSummary = require('sliv-data-summary');
	dataSummary.init();

	var Course = require('sliv-course');
	new Course(dataSummary);

	var Map = require('sliv-map');
	var map = new Map();

	var Filter = require('sliv-filter');
	var filter = new Filter(dataDivisions, PathObserver, map);

	var Art = require('sliv-art');
	new Art(dataDivisions, filter, CompoundObserver);
});