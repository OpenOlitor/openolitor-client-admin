'use strict';

/**
 */
angular.module('openolitor')
  .factory('ProjektService', ['$rootScope', 'ProjektModel', 'msgBus', 'ooAuthService', '$q',
    function($rootScope, ProjektModel, msgBus, ooAuthService, $q) {

      var projekt;

      var loadProjekt = function() {
        var deferred = $q.defer();

        ooAuthService.resolveUser().then(function() {
          if (projekt) {
            deferred.resolve(projekt);
          } else {
            ProjektModel.query({}, function(result) {
              projekt = result;
              deferred.resolve(projekt);
            }, function(error) {
              deferred.reject(error);
            });
          }
        });

        return deferred.promise;
      };

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Projekt') {
          $rootScope.$apply();
        }
      });

      return {
        resolveProjekt: loadProjekt
      };
    }
  ]);
