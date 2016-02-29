'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProjektService', ['$rootScope', 'ProjektModel', 'msgBus',
    function($rootScope, ProjektModel, msgBus) {

      var projekt;

      var load = function() {
        ProjektModel.query({}, function(result) {
          projekt = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getProjekt: function() {
          return projekt;
        }
      };
    }
  ]);
