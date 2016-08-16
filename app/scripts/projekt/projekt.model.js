'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProjektModel', function($resource, API_URL) {
    return $resource(API_URL + 'projekt/:id', {
      id: '@id'
    }, {'query': {method:'GET', isArray: false}});
  });
