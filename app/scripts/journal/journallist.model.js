'use strict';

angular.module('openolitor-admin')
  .factory('JournalModel', ['$resource', 'API_URL', 'exportODSModuleFunction', 'exportODSModuleFunction',
  function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'admin/events/', { } , {
      'exportODS': exportODSModuleFunction
    });
  }]);
