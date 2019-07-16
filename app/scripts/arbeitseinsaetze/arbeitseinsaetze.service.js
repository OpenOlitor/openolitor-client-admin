'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsaetzeService', ['$rootScope', 'ArbeitseinsaetzeModel', 'msgBus',
    function($rootScope, ArbeitseinsaetzeModel, msgBus) {

      var arbeitseinsaetze;

      var load = function() {
        ArbeitseinsaetzeModel.query({}, function(result) {
          arbeitseinsaetze = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitseinsatz') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitseinsatz') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitseinsatz') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getArbeitseinsaetze: function() {
          return arbeitseinsaetze;
        }
      };
    }
  ]);
