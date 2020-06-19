'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbotypenDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'abotypen/:id', {
      id: '@id'
    });
  });
