'use strict';

/**
 */
angular.module('openolitor')
  .factory('KundentypenService', ['KundentypenModel',
    function(KundentypenModel) {

      var kundentypen;

      KundentypenModel.query({}, function(result) {
        kundentypen = result;
      });

      return {
        getKundentypen: function() {
          return kundentypen
        },
        VEREINSMITGLIED: 'Vereinsmitglied'
      }
    }
  ]);
