'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProduktekategorienModel', function($resource, API_URL) {
    return $resource(API_URL + 'produktekategorien/:id', {
      id: '@id'
    });
  });
