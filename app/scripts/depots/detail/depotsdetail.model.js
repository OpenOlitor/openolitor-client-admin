'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('DepotsDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'depots/:id', {
      id: '@id'
    });
  });
