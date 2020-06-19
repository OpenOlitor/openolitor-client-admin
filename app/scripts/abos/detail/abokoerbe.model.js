'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AboKoerbeModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:kundeId/abos/:id/koerbe', {
      id: '@id',
      kundeId: '@kundeId'
    });
  });
