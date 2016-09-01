'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('VorlagenModel', function($resource, API_URL) {
    return $resource(API_URL + 'vorlagen/:id', {
      id: '@id'
    });
  });
