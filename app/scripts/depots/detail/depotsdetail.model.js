'use strict';

/**
 */
angular.module('openolitor')
  .factory('DepotsDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'depots/:id', {
      id: '@id'
    });
  });
