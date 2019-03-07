'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('MailvorlageTypenModel', function($resource, API_URL) {
    return $resource(API_URL + 'mailtemplatetypes', {
      id: '@id'
    });
  });
