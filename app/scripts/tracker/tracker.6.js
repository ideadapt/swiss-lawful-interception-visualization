function Tracker(params){
	var self = this;
	self.year = null;

	function init(){
		return Promise.resolve();
	}

	function controller(){
		function paramsChanged(state){
			if(state.env === 'prod' && self.year !== state.year){
				var $img = $('<img>').attr('id', 'tracker').attr('src', '//piwik.xiala.net/piwik.php?idsite=2&rec=1&action_name=SLIV-'+state.year+'-'+state.locale);
				$('#tracker').remove();
				$('body').append($img);
				self.year = state.year;
			}
		}
		params.emitter.on('pathChanged', paramsChanged);
	}

	init.call(this)
		.then(controller.bind(this))
		.catch((err) => {
			console.error(err);
		});
}

module.exports = Tracker;