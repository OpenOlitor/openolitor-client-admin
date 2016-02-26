'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProjektModel', function($resource, API_URL) {
    return $resource(API_URL + 'projekt/', {}, {'query': {method:'GET', isArray: false}});
  });
