'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduzentDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'produzenten/:id', {
      id: '@id'
    });
  });
