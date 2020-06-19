'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourenDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'touren/:id', {
      id: '@id'
    });
  });
