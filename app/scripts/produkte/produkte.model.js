'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProdukteModel', function($resource, API_URL) {
    return $resource(API_URL + 'produkte/:id', {
      id: '@id'
    });
  });
