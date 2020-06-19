'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KontoDatenModel', ['$resource', 'appConfig', function ($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kontodaten/:id', {
      id: '@id'
    }, {
        'query': {
          method: 'GET',
          isArray: false
        }
      });
  }]);
