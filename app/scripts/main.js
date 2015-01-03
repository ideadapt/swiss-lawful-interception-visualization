/*global CompoundObserver*/
$(document).ready(function(){
	require('es6-promise').polyfill();
	var data = require('sliv-data');
	data.init();

	var Filter = require('sliv-filter');
	var filter = new Filter(data);

	var Art = require('sliv-art');
	new Art(data, filter, CompoundObserver);
});