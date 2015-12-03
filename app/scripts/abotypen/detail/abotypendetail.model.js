'use strict';

/**
 */
angular.module('openolitor')
  .factory('AbotypenDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'abotypen/:id', {
      id: '@id'
    });
  });
