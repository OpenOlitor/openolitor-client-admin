'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAboModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:kundeId/abos/:hauptAboId/zusatzAbos/:id', {
      id: '@id',
      kundeId: '@kundeId',
      hauptAboId: '@hauptAboId'
    });
});
