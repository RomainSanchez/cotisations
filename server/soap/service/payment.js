'use strict';

const util = require('util');
const SoapClient = require('../soap-client');
const debtParser = require('../parser/debt-parser');

module.exports = function(app, options) {
    app.use(options.path, async function(req, res, next) {
        res.send(await importDebts(app));
  });
};

async function importDebts (app) {
    const config = app.get('app');
    const client = await new SoapClient.client(config.soap.url).getInstance();
    // Promisify callback based soap function
    const getDebts = util.promisify(client.RecapCotis);

    // GET DEBTS
    let params = config.soap.services.recapCotis.data;

    params.sreponse.Annee = new Date().getFullYear();

    let debts = await getDebts(params);

    debts = debtParser.parse(debts, config.vocabulary);

    await app.models.Debt.create(debts);

    return debts;
};
