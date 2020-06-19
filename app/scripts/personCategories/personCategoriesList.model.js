'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PersonCategoriesModel', function($resource, appConfig) {
    return $resource(appConfig.get().API_URL + 'personCategories/:id', {
      id: '@id'
    });
  });
