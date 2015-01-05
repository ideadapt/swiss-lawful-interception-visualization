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
		function cantonEnter(){
			$('#filter cantons .btn[value='+this.id+']').addClass('focus');
		}
		function cantonLeave(){
			$('#filter cantons .btn[value='+this.id+']').removeClass('focus');
		}
		for(var i = 0; i<cantons.length;i++){
			cantons[i].addEventListener('click', cantonClicked, false);
			cantons[i].addEventListener('mouseenter', cantonEnter, false);
			cantons[i].addEventListener('mouseleave', cantonLeave, false);
		}
	};

	window.map = this.interface;
	this.controller();
});