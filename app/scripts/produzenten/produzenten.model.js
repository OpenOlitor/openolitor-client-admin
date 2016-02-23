'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProduzentenModel', function($resource, API_URL) {
    return $resource(API_URL + 'produzenten/:id', {
      id: '@id'
    });
  });
