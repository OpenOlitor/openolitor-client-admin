'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ZusatzabosDetailModel', function($resource, API_URL) {
    return $resource(API_URL + 'zusatzabotypen/'
    );
  });
