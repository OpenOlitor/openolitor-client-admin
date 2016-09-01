'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('VorlageTypenModel', function($resource, API_URL) {
    return $resource(API_URL + 'vorlagetypen', {
      id: '@id'
    });
  });
