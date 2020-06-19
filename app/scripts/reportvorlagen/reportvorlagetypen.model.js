'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportvorlageTypenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'vorlagetypen', {
      id: '@id'
    });
  });
