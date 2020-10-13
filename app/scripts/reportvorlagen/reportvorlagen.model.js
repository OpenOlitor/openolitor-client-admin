'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportvorlagenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'vorlagen/:id', {
      id: '@id'
    });
  });
