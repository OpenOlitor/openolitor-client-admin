'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('AbotypenOverviewModel', function($resource, API_URL) {
    var now = new Date();
    return $resource(API_URL + 'abotypen/:id', {
      id: '@id'
    });
  });
