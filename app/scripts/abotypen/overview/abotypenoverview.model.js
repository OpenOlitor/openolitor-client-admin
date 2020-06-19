'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbotypenOverviewModel', function($resource, appConfig) {
    var now = new Date();
    return $resource(appConfig.get().API_URL + 'abotypen/:id/:extendedPath/:extendedPathPlus', {
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
