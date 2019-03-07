'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitsangeboteDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'arbeitsangebote/:id', {
      id: '@id'
    });
  });
