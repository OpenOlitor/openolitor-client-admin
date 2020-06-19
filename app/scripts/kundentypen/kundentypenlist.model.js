'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('KundentypenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kundentypen/:id', {
      id: '@id'
    });
  });
