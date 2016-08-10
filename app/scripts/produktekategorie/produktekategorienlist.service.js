'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduktekategorienService', ['$rootScope', 'ProduktekategorienModel', 'msgBus',
    function($rootScope, ProduktekategorienModel, msgBus) {

      var produktekategorien;

      var load = function() {
        ProduktekategorienModel.query({}, function(result) {
          produktekategorien = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Produktekategorie') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Produktekategorie') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Produktekategorie') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getProduktekategorien: function() {
          return produktekategorien;
        }
      };
    }
  ]);
