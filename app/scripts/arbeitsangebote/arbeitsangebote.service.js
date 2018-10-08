'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitsangeboteService', ['$rootScope', 'ArbeitsangeboteModel', 'msgBus',
    function($rootScope, ArbeitsangeboteModel, msgBus) {

      var arbeitsangebote;

      var load = function() {
        ArbeitsangeboteModel.query({}, function(result) {
          arbeitsangebote = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitsangebot') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitsangebot') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitsangebot') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getArbeitsangebote: function() {
          return arbeitsangebote;
        }
      };
    }
  ]);
