/*global PathObserver*/
function Art(data, filter){
	var self = this;
	self.activ = null;

	function init(){
		return Promise.resolve();
	}

	function controller(){
		var yearObserver = new PathObserver(filter, 'year');
		yearObserver.open(function(newYear){
			data.activ(newYear).then(function(activ){
				self.activ = activ;
				render.call(self);
			});
		});
	}

	function render(){
		var template = require('./art.jade');
		var html = template({activ: self.activ});
		$('#art').prepend(html);
		return Promise.resolve();
	}

	init.call(this)
		.then(render.bind(this))
		.then(controller.bind(this));
}

Art.prototype.activ = function activ(){
	return this.activ;
};
module.exports = Art;