'use strict';

const csvToJson = require("csvtojson");

module.exports = function(Payment) {
    Payment.fromCsv = async (data, callback) => {
        const csv = Object.keys(data)[0];

        const rows = await csvToJson().fromString(csv);
        console.log(rows[12])

        for(const row of rows) {
            const payment = {
                date: row.Date,
                valueDate: row.Valeur,
                debit: row.Débit.replace(' ', '').replace(',', '.'),
                credit: row.Crédit.replace(' ', '').replace(',', '.'),
                label: row.Libellé
            };

            if (!isValid(payment) || await exists(payment)) {
                continue;
            }

            await Payment.create(payment);
        }

        callback(null, 'ok');
    };

    Payment.getMatched = async (callback) => {
        const payments = await Payment.find({
            include: ['debts'],
            where: {
                disbursedAt: null
            }
        });

        return payments.filter(payment => payment.debts().length > 0);
    }

    Payment.getUnmatched = async () => {
        const payments = Payment.find({
            include: ['debts'],
            where: {
                credit: {
                    neq: ''
                },
                disbursedAt: null
            }
        });

        return payments.filter(payment => payment.debts().length === 0);
    }

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

    Payment.remoteMethod('getMatched', {
        http: {
            verb: 'get'
        },
        returns: {
            arg: 'data',
            type: 'array',
            root: true
        }
    });

    Payment.remoteMethod('getUnmatched', {
        http: {
            verb: 'get'
        },
        returns: {
            type: 'array',
            root: true
        }
    });

    const exists = async (payment) => {
        const existing = await Payment.findOne({
            where: {
                label: payment.label,
                date: payment.date,
                credit: payment.credit
            }
        });

        return existing !== null;
    }

    const isValid = (payment) => {
        if (payment.label === null || payment.label === '') {
            return false;
        }

        if (payment.date === null || payment.date === '') {
            return false;
        }

        return true;
    }
};
