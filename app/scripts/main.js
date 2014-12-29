/*global PathObserver*/
$(window).load(function(){
	// require map

	// in any other module
	var mapSelectionChanged = new PathObserver(window.map, 'selected');
	mapSelectionChanged.open(function(newValue, oldValue){
		console.log('changed handler', oldValue, newValue);
	});
});