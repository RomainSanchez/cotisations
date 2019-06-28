'use strict';

const util = require('util');
const soapClient = require('../soap-client');
const communityParser = require('../parser/community-parser');

module.exports = function(app, options) {
    app.use(options.path, async function(req, res, next) {
        res.send(await importCommunities(app));
  });
};

async function importCommunities (app) {
    const config = app.get('app');
    const client = await new soapClient.client(config.soap.url).getInstance();
    // Promisify callback based soap function
    const getCommunities = util.promisify(client.ListeCollectivite);

    // GET COMMUNITIES
    let communities = await getCommunities(config.soap.services.listeCollectivites.data);

    communities = communityParser.parse(communities);

    for (const community of communities) {
        const existing = await app.models.Community.findOne({where: {
            'agirheCode': community.agirheCode,
            'siret': community.siret
        }});

        if(existing) {
            community.id = existing.id;
        }

        await app.models.Community.updateOrCreate(community);
    }

    return communities;
};
