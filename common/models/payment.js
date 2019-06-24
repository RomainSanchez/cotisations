'use strict';

const csvToJson = require("csvtojson");

module.exports = function(Payment) {
    Payment.fromCsv = async (data, callback) => {
        const payments = [];
        const csv = Object.keys(data)[0];

        const rows = await csvToJson().fromString(csv);

        rows.forEach((row) => {
            payments.push({
                date: row.Date,
                valueDate: row.Valeur,
                debit: row.Débit.replace(' ', '').replace(',', '.'),
                credit: row.Crédit.replace(' ', '').replace(',', '.'),
                label: row.Libellé
            });
        });

        await Payment.create(payments);

        callback(null, 'ok');
    };

    Payment.remoteMethod('fromCsv', {
        http: {
            verb: 'post'
        },
        accepts: [
            {arg: 'data', type: 'object', http: {source: 'body'}}
        ],
        returns: {
            arg: 'response',
            type: 'object'
        }
    });
};
