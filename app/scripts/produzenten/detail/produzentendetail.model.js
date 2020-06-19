'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduzentDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'produzenten/:id', {
      id: '@id'
    });
  });
