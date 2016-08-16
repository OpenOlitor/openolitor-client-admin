'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProdukteService', ['$rootScope', 'ProdukteModel', 'msgBus',
    function($rootScope, ProdukteModel, msgBus) {

      var kundentypen;

      var load = function() {
        ProdukteModel.query({}, function(result) {
          kundentypen = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Produkt') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Produkt') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Produkt') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getProdukte: function() {
          return kundentypen;
        }
      };
    }
  ]);
