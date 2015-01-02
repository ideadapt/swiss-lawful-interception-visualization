/*global Papa*/

function Data(){
	var self = this;
	self.transformed = null;

	this.init = function init(){
		self.transformed = Promise.resolve($.ajax({
			url: 'data/data.csv'
		})).then(function transform(data){
			var parsedCsv = Papa.parse(data);
			parsedCsv.data[0].splice(0,3);
			var cantons = parsedCsv.data[0];
			var flat = [];
			parsedCsv.data.splice(0, 1);
			parsedCsv.data.map(function(row){
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
}

// public interface
Data.prototype.all = function all(){
	return this.transformed;
};

var data = new Data();
module.exports = data;