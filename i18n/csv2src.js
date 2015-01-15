// transform csv to json structure, exporting a map
var parse = require('csv-parse');
var fs = require('fs');
var parser = parse({delimeter: ';', columns: true, skip_empty_lines: true}); // jshint ignore:line
var inputStream = fs.createReadStream(__dirname+'/../app/data/slirv_translations.csv');
var outputStream = fs.createWriteStream(__dirname+'/translations.js');
var recordIdx = 0;
var translations = {};
var langs = ['de'];
langs.forEach(function lang(lang){
    translations[lang] = {};
});

parser
.on('readable', function(){
    var record = {};
    while(record = parser.read()){ //jshint ignore:line
        langs.forEach(function (lang){
        	var key = [record.group, record.typ, record.detail].join('_').toUpperCase();
        	translations[lang][key] = record[lang];
            recordIdx += 1;
        }); //jshint ignore:line
    }
})
.on('end', function(){
    outputStream.write('/*jshint ignore:start*/\n');
    outputStream.write('var locales = ');
    outputStream.write(JSON.stringify(translations, true));
    outputStream.write('; module.exports = {locales: locales};');
    outputStream.write('\n/*jshint ignore:end*/');
	outputStream.end();
});

inputStream.setEncoding('utf8');
inputStream.pipe(parser);
