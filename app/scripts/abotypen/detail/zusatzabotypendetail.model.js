'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAbotypenDetailModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'zusatzAbotypen/:id', {
      id: '@id'
    });
  });
