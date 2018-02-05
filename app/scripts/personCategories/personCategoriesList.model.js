'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PersonCategoriesModel', function($resource, API_URL) {
    return $resource(API_URL + 'personCategories/:id', {
      id: '@id'
    });
  });
