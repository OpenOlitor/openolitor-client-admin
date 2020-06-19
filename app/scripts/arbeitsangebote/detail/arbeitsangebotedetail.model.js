'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitsangeboteDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'arbeitsangebote/:id', {
      id: '@id'
    });
  });
