'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAbotypenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'zusatzAbotypen/:id', {
      id: '@id'
    });
  });
