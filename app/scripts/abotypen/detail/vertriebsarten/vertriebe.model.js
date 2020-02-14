'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('VertriebeListModel', function($resource, API_URL) {
    return $resource(API_URL + 'abotypen/:abotypId/vertriebe/:id', {
      id: '@id',
      abotypId: '@abotypId'
    },{
      'getAllVertriebe' : {
      method: 'GET',
      isArray: true,
      url: API_URL + 'vertriebe'
      },
    });
  });
