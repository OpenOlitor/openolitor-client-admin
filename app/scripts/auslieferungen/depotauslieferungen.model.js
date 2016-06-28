'use strict';

/**
 */
angular.module('openolitor')
  .factory('DepotAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'depotauslieferungen/:id/:extendedPath/:aktion', {
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
