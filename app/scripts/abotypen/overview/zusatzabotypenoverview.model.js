'use strict';

/**
 */
angular.module('openolitor-admin')
.factory('ZusatzabotypenOverviewModel', function($resource, API_URL) {
    var now = new Date();
    return $resource(API_URL + 'zusatzabotypen/:id/:extendedPath/:extendedPathPlus', {
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
