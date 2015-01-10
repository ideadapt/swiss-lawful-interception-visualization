/*global Papa*/

function DataDivisions(){
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
function byYear(year, e){
	if(year){
		return e.year === year;
	}
	return true;
}
function byCanton(canton, e){
	if(canton){
		return e.canton === canton;
	}
	return true;
}

function sumByYearCantonSuperSub(year, canton, _super, sub){
	return this.transformed.then(function(transformed){
		return transformed.filter(function(r){
			return r.sub === sub && r.super === _super;
		})
		.filter(byYear.bind(null, year))
		.filter(byCanton.bind(null, canton))
		.reduce(function(sum, b){
			return sum + b.value;
		}, 0);
	});
}

DataDivisions.prototype.activ = function(year, canton){
	return sumByYearCantonSuperSub.call(this, year, canton, 'typ', 'aktiv');
};

DataDivisions.prototype.vorratsdaten = function(year, canton){
	return sumByYearCantonSuperSub.call(this, year, canton, 'typ', 'vds');
};

DataDivisions.prototype.telefonbuch = function(year, canton){
	return sumByYearCantonSuperSub.call(this, year, canton, 'art', 'telefon');
};

['terror', 'paedo', 'krimorg', 'nachrichtendienst', 'geldwaesche', 'menschenhandel'].forEach(function(section){
	DataDivisions.prototype[section] = function(year, canton){
		return Promise.all([
			sumByYearCantonSuperSub.call(this, year, canton, 'schwerestraftaten', section),
			sumByYearCantonSuperSub.call(this, year, canton, 'schwerestraftaten', section+'_prozent')
		]);
	};
});

DataDivisions.prototype.cantons = function(){
	return this.transformed.then(function(transformed){
		return transformed.filter(function(r){
			return fakeCantons.indexOf(r.canton) === -1;
		}).map(function(r){
			return r.canton;
		})
		.filter(unique)
		.sort();
	});
};

DataDivisions.prototype.years = function(){
	return this.transformed.then(function(transformed){
		return transformed.map(function(r){
			return r.year;
		})
		.filter(unique)
		.sort();
	});
};

DataDivisions.prototype.fakeCantons = function(){
	return Promise.resolve(fakeCantons);
};

var data = new DataDivisions();
module.exports = data;