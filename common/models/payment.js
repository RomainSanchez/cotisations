'use strict';

const xlsx = require('xlsx');
const multiparty = require('multiparty');

module.exports = function(Payment) {
    Payment.fromCsv = async (req, callback) => {
        const parseForm = (req) => new Promise((resolve, reject) => {
            const form = new multiparty.Form();

            form.parse(req, (err, fields, files) => {
                if(err) return reject(err);

                return resolve(files.file[0]);
            });
        });

        const file = await parseForm(req);
        const xls = xlsx.readFile(file.path);
        const rows = xlsx.utils.sheet_to_json(xls.Sheets[xls.SheetNames[0]]);

        for (const row of rows) {
            if(row.__EMPTY_2 || !row.__EMPTY_3) {
                continue;
            }

            const payment = {
                date: row.__EMPTY,
                valueDate: row[' Relevé des opérations des 60 derniers jours '],
                label: row.__EMPTY_1,
                credit: row.__EMPTY_3.replace(' ', '').replace(',', '.')
            };

            if (await exists(payment)) {
                continue;
            }

            await Payment.create(payment);
        }
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
            { arg: 'req', type: 'object', http: { source: 'req' } },
        ],
        returns: {
            arg: 'response',
            type: 'string'
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
};
