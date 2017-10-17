'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzAbotypenModel', function($resource, API_URL) {
    return $resource(API_URL + 'zusatzAbotypen/'
    );
  });
