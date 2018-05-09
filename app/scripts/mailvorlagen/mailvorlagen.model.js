'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('MailvorlagenModel', function($resource, API_URL) {
    return $resource(API_URL + 'mailtemplates/:id', {
      id: '@id'
    });
  });
