'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduzentenService', ['$rootScope', 'ProduzentenModel', 'msgBus',
    function($rootScope, ProduzentenModel, msgBus) {

      var produzenten;

      var load = function() {
        ProduzentenModel.query({}, function(result) {
          produzenten = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Produzent') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Produzent') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Produzent') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getProduzenten: function() {
          return produzenten;
        }
      };
    }
  ]);
