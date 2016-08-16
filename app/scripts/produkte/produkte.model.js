'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProdukteModel', function($resource, API_URL) {
    return $resource(API_URL + 'produkte/:id', {
      id: '@id'
    });
  });
