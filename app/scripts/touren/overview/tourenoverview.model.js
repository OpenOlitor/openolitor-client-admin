'use strict';

/**
 */
angular.module('openolitor')
  .factory('TourenOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'touren/:id', {
      id: '@id'
    });
  });
