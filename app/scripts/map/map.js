/*global Emitter*/
function Map(){
	var self = this;
	self.emitter = new Emitter();

	function controller(){
		var svgContainer = document.getElementById('svgMap');
		var svg = svgContainer.contentDocument;
		var cantons = svg.querySelectorAll('#Cantons_default>path');

		function cantonClicked(){
			self.emitter.emitSync('selectionChanged', this.id);
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
	}

	controller.call(this);
}

module.exports = Map;