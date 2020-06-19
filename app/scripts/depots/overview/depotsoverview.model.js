'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotsOverviewModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'depots/:id/:extendedPath/:extendedPathPlus', {
      id: '@id'
    }, {
      personen: {
        method: 'GET',
        isArray: true,
        params: {
          extendedPath: 'personen',
          extendedPathPlus: 'aktiv'
        }
      }
    });
  });
