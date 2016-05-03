'use strict';

/**
 */
angular.module('openolitor')
  .factory('KundenRechnungenModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:kundeId/rechnungen', {
      kundeId: '@kundeId'
    });
  });
