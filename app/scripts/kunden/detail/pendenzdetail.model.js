'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PendenzDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'kunden/:kundeId/pendenzen/:id', {
      id: '@id',
      kundeId: '@kundeId'
    });
  });
