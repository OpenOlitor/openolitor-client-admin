'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('JobqueueService', ['$rootScope', '$http', 'API_URL',
    function($rootScope, $http, API_URL) {

      return {
        loadPendingJobs: function() {
          return $http.get(API_URL + 'queue/jobs').then(function(response) {
            return response.data;
          });
        },
        loadPendingJobResults: function() {
          return $http.get(API_URL + 'queue/results').then(function(
            response) {
            return response.data;
          });
        }
      };
    }
  ]);
