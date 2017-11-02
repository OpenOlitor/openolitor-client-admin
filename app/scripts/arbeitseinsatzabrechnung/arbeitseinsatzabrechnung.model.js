'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsatzabrechnungModel', function($resource, API_URL) {
    return $resource(API_URL + 'arbeitseinsatzabrechnung/:id', {
      id: '@id'
    });
  });
