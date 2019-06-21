'use strict';

const util = require('util');
const SoapClient = require('../soap-client');
const debtParser = require('../parser/debt-parser');

let lastCommunity;
let debtModel;
let communityModel;

module.exports = function(app, options) {
    debtModel = app.models.Debt;
    communityModel = app.models.Community;

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

    debts = await debtParser.parse(debts, config.vocabulary);

    //await app.models.Debt.create(debts);
    debts.forEach(async debt => {
        debt.communityId = await getCommunityId(debt.agirheCode);
        debt = await debtModel.create(debt);
    });

    return debts;
};

const getCommunityId = async (agirheCode) => {
    if(lastCommunity && lastCommunity.agirheCode === agirheCode) {
        return lastCommunity.id;
    }

    const community = await communityModel.findOne({
        where: {
            'agirheCode': agirheCode
        }
    });

    lastCommunity = community;

    return community.id;
}
