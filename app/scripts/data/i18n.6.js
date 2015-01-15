/*global Papa*/

function I18n(){
	var self = this;
	self.transformed = null;
	self.language = 'de';

	function init(){
		self.transformed = Promise.resolve($.ajax({
			url: 'data/slirv_translations.csv'
		})).then(function transform(data){
			var parsedCsv = Papa.parse(data, {header: true});
			self.map = {};
			parsedCsv.data.map(row => {
				var key = ['group', 'typ', 'detail']
							.map(key=>{
								return row[key];
							})
							.join('_').toUpperCase();

				self.map[key] = row[self.language];
			});

			return self.map;
		});
		return self.transformed;
	}

	this.l = function l(key){
		return self.map[key] || 'KEY NOT FOUND';
	};

	init.call(this).catch((err) => {
		console.error(err.message);
	});
}

var i18n = new I18n();
module.exports = i18n;