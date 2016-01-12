'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbosDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'kunden/:kundeId/abos/:id', {
      id: '@id',
      kundeId: '@kundeId'
    });
  });
