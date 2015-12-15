'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbosDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'personen/:personId/abos/:id', {
      id: '@id',
      personId: '@personId'
    });
  });
