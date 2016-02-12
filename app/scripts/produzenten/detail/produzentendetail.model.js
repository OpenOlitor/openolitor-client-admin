'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProduzentDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'produzenten/:id', {
      id: '@id'
    });
  });
