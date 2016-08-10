'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourenModel', function($resource, API_URL) {
    return $resource(API_URL + 'touren/:id', {
      id: '@id'
    });
  });
