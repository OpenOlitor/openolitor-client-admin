'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('MailvorlagenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'mailtemplates/:id', {
      id: '@id'
    });
  });
