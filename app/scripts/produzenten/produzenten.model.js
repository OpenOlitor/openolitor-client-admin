'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduzentenModel', function($resource, API_URL) {
    return $resource(API_URL + 'produzenten/:id', {
      id: '@id'
    });
  });
