'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PostAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'postauslieferungen/:id', {
      id: '@id'
    }, {
      ausliefern: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'ausliefern'
        }
      }
    });
  });
