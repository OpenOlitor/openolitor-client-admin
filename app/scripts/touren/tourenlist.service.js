'use strict';

/**
 */
angular.module('openolitor')
  .factory('TourenService', ['$rootScope', 'TourenModel', 'msgBus',
    function($rootScope, TourenModel, msgBus) {

      var touren;

      var load = function() {
        TourenModel.query({}, function(result) {
          touren = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Tour') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Tour') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Tour') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getTouren: function() {
          return touren;
        }
      };
    }
  ]);
