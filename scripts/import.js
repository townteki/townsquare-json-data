/* eslint-disable*/
const fs = require('fs');
const path = require('path');
const request = require('request');
const DtDbCardWriter = require('../src/DtDbCardWriter.js');

var apiUrl = 'http://dtdb.co/api/';
var packDir = path.join(process.cwd(), 'packs');
var writer = new DtDbCardWriter(packDir);
if(!fs.existsSync(packDir)) {
    fs.mkdirSync(packDir);
}

loadPacks().then(packs => {
    for(let pack of packs) {
        writer.writeCardData(pack);
    }
	fs.writeFile('dtr-packs.json', JSON.stringify(packs), function() {
		console.info(packs.length + ' packs fetched');
	});
});


function loadPacks() {
	return new Promise((resolve, reject) => {
		request.get(apiUrl + 'sets', { gzip: true }, function(error, res, body) {
			if(error) {
				return reject(error);
			}
			resolve(JSON.parse(body));
		});
	});
}
