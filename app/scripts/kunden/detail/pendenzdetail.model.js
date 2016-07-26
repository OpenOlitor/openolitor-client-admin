'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PendenzDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:kundeId/pendenzen/:id', {
      id: '@id',
      kundeId: '@kundeId'
    });
  });
