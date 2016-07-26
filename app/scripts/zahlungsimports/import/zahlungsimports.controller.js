'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ZahlungsImportsController', ['$scope', '$rootScope', '$filter',
    '$routeParams',
    '$http',
    '$location',
    '$uibModal',
    'gettext',
    'ZahlungsImportsModel',
    'ZahlungsEingaengeModel',
    'EnumUtil',
    'API_URL',
    'msgBus',
    'Upload',
    'lodash',
    'alertService',
    function($scope, $rootScope, $filter, $routeParams, $http, $location, $uibModal,
      gettext, ZahlungsImportsModel, ZahlungsEingaengeModel, EnumUtil, API_URL, msgBus, Upload, _, alertService) {
      $scope.loading = false;

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'ZahlungsImport') {
          $rootScope.$apply();
        }
      });

      $scope.isExisting = function() {
        return angular.isDefined($scope.zahlungsImport) && angular.isDefined($scope.zahlungsImport.id);
      };

      $scope.delete = function() {
        return $scope.zahlungsImport.$delete;
      };

      $scope.uploadZahlungsImportFile = function(file) {
        if (!file) {
          return;
        }
        Upload.upload({
          url: API_URL + 'zahlungsimports',
          data: {
            file: file
          }
        }).then(function() {}, function(errorResponse) {
          alertService.addAlert('lighterror', gettext(
            'Fehler beim importieren der ESR Datei'));
        });
      };

      if ($routeParams.id) {
        ZahlungsImportsModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.zahlungsImport = result;
        });
      }

      $scope.zahlungsEingangErledigen = function(zahlungsEingang) {
        ZahlungsEingaengeModel.erledigen({
          zahlungsImportId: $scope.zahlungsImport.id,
          id: zahlungsEingang.id,
          bemerkung: zahlungsEingang.bemerkung
        }, function() {});
      };

      $scope.automatischErledigen = function() {
        var entities = $scope.zahlungsImport.zahlungsEingaenge.filter(function(z) {
          return z.status === 'Ok';
        });
        ZahlungsEingaengeModel.automatischErledigen({
            zahlungsImportId: $scope.zahlungsImport.id,
          },
          entities,
          function() {});
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'ZahlungsImport') {
          $location.path('/zahlungsimports/' + msg.data.id);
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'ZahlungsEingang') {
          var eingang = msg.data;
          var i = _.findIndex($scope.zahlungsImport.zahlungsEingaenge, function(e) {
            return e.id === eingang.id;
          });
          $scope.zahlungsImport.zahlungsEingaenge[i] = eingang;
          $scope.$apply();
        }
      });
    }
  ]);
