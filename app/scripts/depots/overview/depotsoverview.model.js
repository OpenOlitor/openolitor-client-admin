'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotsOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'depots/:id', {
      id: '@id'
    });
  });
