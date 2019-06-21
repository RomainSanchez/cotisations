'use strict';

const util = require('util');
const SoapClient = require('./soap-client');
const debtParser = require('./parser/debt-parser');
const communityParser = require('./parser/community-parser');

module.exports = function(app, options) {
    app.use(options.path, async function(req, res, next) {
        res.send(await importAgirheData(app));
    });
};

// async function importAgirheData (app) {
//     const data = {};
//     const config = app.get('app');
//     const client = await new SoapClient.client(config.soap.url).getInstance();
//     // Promisify callback based soap functions
//     const getDebts = util.promisify(client.RecapCotis);
//     const getCommunities = util.promisify(client.ListeCollectivite);

//     // GET DEBTS
//     let params = config.soap.services.recapCotis.data;

//     params.sreponse.Annee = new Date().getFullYear();

//     const debts = await getDebts(params);

//     data.debts = debtParser.parse(debts, config.vocabulary);

//     await app.models.Debt.create(data.debts);


//     // GET COMMUNITIES
//     const communities = await getCommunities(config.soap.services.listeCollectivites.data);

//     data.communities = communityParser.parse(communities);

//     await app.models.Community.create(data.communities);

//     return data;
// };
