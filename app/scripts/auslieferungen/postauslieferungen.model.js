'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('PostAuslieferungenModel', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'postauslieferungen/:id/:extendedPath/:aktion', {
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
  });
