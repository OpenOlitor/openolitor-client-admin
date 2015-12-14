'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbosOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'abos/:id', {
      id: '@id'
    });
  });
