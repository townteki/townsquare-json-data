const fs = require('fs');
const path = require('path');
const request = require('request');

var apiUrl = 'http://dtdb.co/api/';

class DtDbCardWriter {
    constructor(pathToPacks) {
        this.pathToPacks = pathToPacks;
    }

    writeCardData(pack) {
        let tempPackPath = this.pathToPacks;
        request.get(apiUrl + 'cards', { gzip: true }, function(error, res, body) {
            if(error) {
                console.error(error);
                return;
            }
            var cards = JSON.parse(body);
            let currentPackCards = cards.filter(card => card.pack_code === pack.code);
            currentPackCards.sort((a, b) => a.code < b.code ? -1 : 1);

            if(currentPackCards.length == 0) {
                console.error('Cards corresponding to', pack.name, 'have not been released yet on DTDB.');
                return;
            }

            pack.cards = currentPackCards;
            fs.writeFileSync(path.join(tempPackPath, pack.code) + '.json', JSON.stringify(pack, null, 4) + '\n');
            console.log('[Card Import] ', pack.name, 'has been completed.');
        });
    }
}

module.exports = DtDbCardWriter;
