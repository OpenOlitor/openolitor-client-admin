'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KontoDatenModel', ['$resource', 'API_URL', function ($resource, API_URL) {
    return $resource(API_URL + 'kontodaten/:id', {
      id: '@id'
    }, {
        'query': {
          method: 'GET',
          isArray: false
        }
      });
  }]);
