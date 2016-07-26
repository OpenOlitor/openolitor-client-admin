'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduktekategorienModel', function($resource, API_URL) {
    return $resource(API_URL + 'produktekategorien/:id', {
      id: '@id'
    });
  });
