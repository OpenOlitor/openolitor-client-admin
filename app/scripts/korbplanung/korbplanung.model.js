'use strict';

/**
 */
angular.module('openolitor')
  .factory('KorbplanungModel', function($resource, API_URL) {
    return $resource(API_URL + 'planungen/:id', {
      id: '@id'
    });
  });
