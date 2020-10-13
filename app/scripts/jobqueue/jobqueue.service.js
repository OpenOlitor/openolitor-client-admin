'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('JobqueueService', ['$rootScope', '$http', 'appConfig',
    function($rootScope, $http, appConfig) {

      return {
        loadPendingJobs: function() {
          return $http.get(appConfig.get().API_URL + 'queue/jobs').then(function(response) {
            return response.data;
          });
        },
        loadPendingJobResults: function() {
          return $http.get(appConfig.get().API_URL + 'queue/results').then(function(
            response) {
            return response.data;
          });
        }
      };
    }
  ]);
