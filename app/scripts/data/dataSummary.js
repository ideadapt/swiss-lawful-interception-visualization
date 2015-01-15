/*global Papa*/

function DataSummary(){
	var self = this;
	self.transformed = null;

	this.init = function init(){
		self.transformed = Promise.resolve($.ajax({
			url: 'data/slirv_data_annualsummary.csv'
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
				row.splice(0, 3);
				row.map(function(val, i){
					flat.push({
						'super': superc,
						'sub': sub,
						'canton': cantons[i],
						'value': +val,
						'year': +year
					});
				});
			});
			return flat;
		});
	};
}

function unique(e, i, arr) {
    return arr.lastIndexOf(e) === i;
}
var fakeCantons = ['CH', 'BA'];

function bySuperSub(_super, sub){
	return this.transformed.then(function(transformed){
		return transformed.filter(function(r){
			return r.sub === sub && r.super === _super;
		});
	});
}

DataSummary.prototype.activ = function(){
	return bySuperSub.call(this, 'typ', 'aktiv');
};

DataSummary.prototype.vds = function(){
	return bySuperSub.call(this, 'typ', 'vds');
};

DataSummary.prototype.techadm = function(){
	return bySuperSub.call(this, 'typ', 'techadm');
};

DataSummary.prototype.telefonbuch = function(){
	return bySuperSub.call(this, 'typ', 'telefonbuch');
};

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