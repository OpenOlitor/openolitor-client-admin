'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAboModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:kundeId/abos/:hauptAboId/zusatzAbos/:id', {
      id: '@id',
      kundeId: '@kundeId',
      hauptAboId: '@hauptAboId'
    });
});
