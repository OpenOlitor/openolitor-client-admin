'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitskategorienModel', function($resource, API_URL) {
    return $resource(API_URL + 'arbeitskategorien/:id', {
      id: '@id'
    });
  });
