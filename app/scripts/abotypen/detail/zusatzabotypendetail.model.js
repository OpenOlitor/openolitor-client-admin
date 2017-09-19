'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzabotypenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'zusatzAbotypen/:id', {
      id: '@id'
    });
  });
