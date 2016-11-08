'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitskategorienService', ['$rootScope', 'ArbeitskategorienModel', 'msgBus',
    function($rootScope, ArbeitskategorienModel, msgBus) {

      var arbeitskategorien;

      var load = function() {
        ArbeitskategorienModel.query({}, function(result) {
          arbeitskategorien = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitskategorie') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitskategorie') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitskategorie') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getArbeitskategorien: function() {
          return arbeitskategorien;
        }
      };
    }
  ]);
