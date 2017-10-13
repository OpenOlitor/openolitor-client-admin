'use strict';
/**
 */
angular.module('openolitor-admin')
  .factory('ProjektService', ['$rootScope', 'OpenProjektModel','ProjektModel', 'msgBus', 'ooAuthService', '$q',
    function($rootScope, OpenProjektModel, ProjektModel, msgBus, ooAuthService, $q) {

      var projekt;

      var loadProjekt = function(openProjekt, reload) {
        var deferred = $q.defer();

        ooAuthService.resolveUser().then(function() {
            if (!reload && projekt) {
              deferred.resolve(projekt);
            } else {
              if (!openProjekt){
                ProjektModel.query({}, function(result) {
                  projekt = result;
                  deferred.resolve(projekt);
                }, function(error) {
                  deferred.reject(error);
                });
              }else{
                OpenProjektModel.query({}, function(result) {
                  projekt = result;
                  deferred.resolve(projekt);
                }, function(error) {
                  deferred.reject(error);
                });
              }
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
