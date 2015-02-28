function Index(i18n, _window, _document){
	var self = this;
	var screenfull = require('screenfull');
	self.document = _document;
	self.window = _window;

	function inFrame () {
	    try {
	        return self.window.self !== self.window.top;
	    } catch (e) {
	        return true;
	    }
	}

	function init(){
		$('#mainTitle').text(i18n.l('title_txt_maintitle'));
		self.document.title = i18n.l('title_txt_maintitle');

		$('#welcomeText').append($('<p>').html(i18n.l('longtext_descr_welcome')));
		$('#impressum>h2').html(i18n.l('title_txt_impressum'));
		$('#impressum>p').html(i18n.l('longtext_descr_impressum'));
		$('#slir>h2').html(i18n.l('title_txt_slir'));
		$('#slir>p').html(i18n.l('longtext_descr_slir'));
		$('#slir>a').attr('href', i18n.l('quelle_url_slir'));
		$('#quellen>h2').html(i18n.l('title_txt_quellen'));
		$('#quellen>p').html(i18n.l('longtext_descr_quellen'));

		var menuTemplate = require('./langMenu.jade');
		var menuHtml = menuTemplate({view: { languages: i18n.languages}, l: i18n.l});
		$('#lang-menu').html(menuHtml);

		if(inFrame()){
			if (screenfull.enabled) {
				self.document.addEventListener(screenfull.raw.fullscreenchange, function () {
					$('#fullscreen').toggleClass('in-fullscreen', screenfull.isFullscreen);
			    });

				$('#fullscreen')
				.text(i18n.l('txt_txt_fullscreen'))
				.addClass('in-frame')
				.on('click', function () {
				    screenfull.request();
				});
			}
		}
	}

	init();
}

module.exports = Index;