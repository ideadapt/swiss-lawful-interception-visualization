$(window).load(function(){
	var self = this;
	this.interface = {
		selected: null
	};

	this.controller = function controller(){
		var svgContainer = document.getElementById('svgMap');
		var svg = svgContainer.contentDocument;
		var cantons = svg.querySelectorAll('#Cantons_default>path');

		function cantonClicked(){
			self.interface.selected = this.id;
		}
		for(var i = 0; i<cantons.length;i++){
			cantons[i].addEventListener('click', cantonClicked, false);
		}
	};

	window.map = this.interface;
	this.controller();
});