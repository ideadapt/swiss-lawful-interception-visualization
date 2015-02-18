/*global Emitter*/
function Map(){
	var self = this;
	self.emitter = new Emitter();
}

Map.prototype.controller = function controller(){
	var self = this;
	var svgContainer = document.getElementById('svgMap');
	var svg = svgContainer.contentDocument;
	if(!svg){
		console.log('hide map, screen to small');
		return;
	}
	var cantons = svg.querySelectorAll('#Cantons_default>path');

	function cantonClicked(){
		self.emitter.emitSync('selectionChanged', this.id.toLowerCase());
	}
	function cantonEnter(){
		$('#filter cantons .btn[value='+this.id.toLowerCase()+']').addClass('focus');
	}
	function cantonLeave(){
		$('#filter cantons .btn[value='+this.id.toLowerCase()+']').removeClass('focus');
	}
	for(var i = 0; i<cantons.length;i++){
		cantons[i].addEventListener('click', cantonClicked, false);
		cantons[i].addEventListener('mouseenter', cantonEnter, false);
		cantons[i].addEventListener('mouseleave', cantonLeave, false);
	}
};

Map.prototype.init = function init(){
	this.controller.call(this);
};

module.exports = Map;