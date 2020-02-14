'use strict';

module.exports = function(app) {
  // https://github.com/strongloop/loopback/issues/404
  app.datasources.mysql.setMaxListeners(Object.keys(app.models).length);
  app.dataSources.mysql.autoupdate();
  console.log('Performed automigration.');
};
