'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundenDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:id', {
      id: '@id'
    });
  });
