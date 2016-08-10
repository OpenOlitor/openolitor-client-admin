'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotAuslieferungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'depotauslieferungen/:extendedPath/:aktion', {
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
