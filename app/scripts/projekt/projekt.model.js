'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProjektModel', function($resource, API_URL) {
    return $resource(API_URL + 'projekt/:id', {
      id: '@id'
    }, {'query': {method:'GET', isArray: false}});
  });
