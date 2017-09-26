'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportsService', ['$rootScope', 'ReportsModel', 'msgBus',
    function($rootScope, ReportsModel, msgBus) {

      var reports;

      var load = function() {
        ReportsModel.query({}, function(result) {
          reports = result;
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Reports') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Reports') {
          load();
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Reports') {
          load();
          $rootScope.$apply();
        }
      });

      return {
        getReports: function() {
          return reports;
        }
      };
    }
  ]);
