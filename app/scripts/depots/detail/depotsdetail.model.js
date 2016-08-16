'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotsDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'depots/:id', {
      id: '@id'
    });
  });
