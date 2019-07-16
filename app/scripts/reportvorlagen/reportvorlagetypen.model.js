'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportvorlageTypenModel', function($resource, API_URL) {
    return $resource(API_URL + 'vorlagetypen', {
      id: '@id'
    });
  });
