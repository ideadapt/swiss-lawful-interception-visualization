/*global Papa*/
function DataSummary(){
	var self = this;
	self.transformed = null;

	function init(){
		self.transformed = Promise.resolve($.ajax({
			url: 'data/slirv_data_annualsummary.csv'
		})).then(function transform(data){
			var parsedCsv = Papa.parse(data, {header: true});
			//Field,FieldValueExport,year,CH
			//typ,aktiv,1998,2138
			var flat = [];
			parsedCsv.data.map(function(row){
				var superc = row.Field;
				var sub = row.FieldValueExport;
				var year= row.year;
				flat.push({
					'super': superc,
					'sub': sub,
					'value': row.CH.length === 0 ? NaN : +row.CH,
					'year': +year
				});
			});
			return flat;
		});
		return self.transformed;
	}

	init.call(this).catch(err => {
		console.error(err);
	});
}

function unique(e, i, arr) {
    return arr.lastIndexOf(e) === i;
}
var fakeCantons = ['ch', 'ba'];

function bySuperSub(_super, sub){
	return this.transformed.then(function(transformed){
		return transformed.filter(function(r){
			return r.sub === sub && r.super === _super;
		});
	});
}


['aktiv', 'vds', 'techadm', 'telefonbuch', 'facebook', 'microsoft'].forEach(function(section){
	DataSummary.prototype[section] = function(){
		return bySuperSub.call(this, 'typ', section);
	};
});

DataSummary.prototype.years = function(){
	return this.transformed.then(function(transformed){
		return transformed.map(function(r){
			return r.year;
		})
		.filter(unique)
		.sort();
	});
};

DataSummary.prototype.fakeCantons = function(){
	return Promise.resolve(fakeCantons);
};

var data = new DataSummary();
module.exports = data;