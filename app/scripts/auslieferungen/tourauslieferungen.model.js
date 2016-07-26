'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'tourauslieferungen/:id', {
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
