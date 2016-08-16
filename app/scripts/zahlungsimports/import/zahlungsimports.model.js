'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZahlungsImportsModel', function($resource, API_URL) {
    return $resource(API_URL + 'zahlungsimports/:id/:extendedPath/:aktion', {
      id: '@id'
    }, {
      importieren: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'importieren'
        }
      }
    });
  });
