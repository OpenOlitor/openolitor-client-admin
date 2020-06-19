'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PendenzenOverviewModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'pendenzen/:id', {
      id: '@id'
    });
  });
