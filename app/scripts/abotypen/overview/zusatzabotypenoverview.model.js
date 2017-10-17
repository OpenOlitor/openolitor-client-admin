'use strict';

/**
 */
angular.module('openolitor-admin')
.factory('ZusatzAbotypenOverviewModel', function($resource, API_URL) {
    var now = new Date();
    return $resource(API_URL + 'zusatzAbotypen/:id/:extendedPath/:extendedPathPlus', {
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
