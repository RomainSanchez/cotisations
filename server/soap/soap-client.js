// Déclaration des librairies nécessaires
let soap = require('soap');
let Promise = require('bluebird');

module.exports = {
    /**
     * Crée un objet SoapClient pointant sur l'url passée en paramètre
     * @param config
     * @constructor
     */
    client: function(url) {
      const that = this;

      this.getInstance = function() {
          return new Promise(function (resolve, reject) {
              if (!that.client) {
                  soap.createClientAsync(url).then((client) => {
                    that.client = client;
                      resolve(client);
                  });
              }else {
                
                resolve(that.client);
              }
          });
      }
    }
};