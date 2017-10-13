'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('TourAuslieferungenModel',  ['$resource', 'API_URL', 'exportODSModuleFunction', 
    function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'tourauslieferungen/:id:exportType/:extendedPath/:aktion', {
      id: '@id'
    }, {
      ausliefern: {
        method: 'POST',
        params: {
          extendedPath: 'aktionen',
          aktion: 'ausliefern'
        }
      },
      'exportODS': exportODSModuleFunction
    });
  }]);
