'use strict';

/**
 */
angular.module('openolitor')
  .factory('KundentypenService', ['$rootScope', 'KundentypenModel', 'msgBus',
    function($rootScope, KundentypenModel, msgBus) {

      var kundentypen;

      var load = function() {
        KundentypenModel.query({}, function(result) {
          kundentypen = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getKundentypen: function() {
          return kundentypen;
        },
        VEREINSMITGLIED: 'Vereinsmitglied'
      };
    }
  ]);
