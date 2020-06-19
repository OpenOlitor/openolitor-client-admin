'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ProduktekategorienModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'produktekategorien/:id', {
      id: '@id'
    });
  });
