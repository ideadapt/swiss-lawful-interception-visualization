function Index(i18n){

	function init(){
		$('#mainTitle').text(i18n.l('title_txt_maintitle'));
		window.document.title = i18n.l('title_txt_maintitle');

		$('#welcome').append($('<p>').html(i18n.l('longtext_descr_welcome')));
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
	}

	init();
}

module.exports = Index;