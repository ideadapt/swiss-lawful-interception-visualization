/*global Papa*/
(function(){
	function Data(){
		var self = this;
		this.parsed = null;

		this.init = function init(){
			self.parsed = Promise.resolve($.ajax({
				url: 'data/data.csv'
			})).then(function transform(data){
				var parsed = Papa.parse(data);
				// TODO map each item to object with headers as property
				// {super: 'art', sub:'internet', canton: 'GR', value: '9', year: '2013'}
				parsed.data[0].splice(0,3);
				var cantons = parsed.data[0];
				var flat = [];
				parsed.data.splice(0, 1);
				parsed.data.map(function(row){
					var superc = row[0];
					var sub = row[1];
					var year= row[2];
					row.splice(0, 2);
					row.map(function(val, i){
						flat.push({
							'super': superc,
							'sub': sub,
							'canton': cantons[i],
							'value': val,
							'year': year
						});
					});
				});
				return flat;
			});
		};
		this.init();

		return {
			all: function all(){
				return self.parsed;
			},
			init: function init(){
				self.init();
			}
		};
	}
	window.data = new Data();
})();