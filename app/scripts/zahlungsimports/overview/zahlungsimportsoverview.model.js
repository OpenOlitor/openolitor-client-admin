'use strict';

/**
 */
angular.module('openolitor')
  .factory('ZahlungsImportsOverviewModel', function($resource, API_URL) {
    return $resource(API_URL + 'zahlungsimports/:id', {
      id: '@id'
    });
  });
