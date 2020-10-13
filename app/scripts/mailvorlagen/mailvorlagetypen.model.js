'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('MailvorlageTypenModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'mailtemplatetypes', {
      id: '@id'
    });
  });
