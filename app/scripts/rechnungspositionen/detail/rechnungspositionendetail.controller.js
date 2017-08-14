'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionDetailController', ['$scope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'RechnungsPositionenModel', 'KundenDetailModel', 'RECHNUNGSPOSITIONSSTATUS',
    'moment', 'EnumUtil', 'DataUtil', 'msgBus', '$q', 'lodash',
    'API_URL', 'alertService', 'NgTableParams',

    function($scope, $filter, $routeParams, $location, $route, $uibModal,
      $log, $http, gettext,
      RechnungsPositionenModel, KundenDetailModel, RECHNUNGSPOSITIONSSTATUS,
      moment, EnumUtil, DataUtil, msgBus, $q, lodash, API_URL,
      alertService, NgTableParams) {


      $scope.rechnungsPositionenStatus = EnumUtil.asArray(RECHNUNGSPOSITIONSSTATUS);

      $scope.cancel = function() {
        $location.path(basePath);
      };

      $scope.delete = function() {
        return $scope.abo.$delete();
      };


      function resolveKunde(id) {
        return KundenDetailModel.get({
          id: id
        }, function(kunde) {
          $scope.kunde = kunde;
        }).$promise;
      }

      var unwatchRechnungsPositionsId = $scope.$watch('rechnungsPosition.id', function(id) {
          resolveKunde($scope.rechnungsPosition.kundeId);
      });

      $scope.loading = false;

      $scope.actions = [{
        label: gettext('Speichern'),
        noEntityText: true,
        onExecute: function() {
          return $scope.rechnungsPosition.$save();
        }
      }, {
        label: gettext('Löschen'),
        iconClass: 'glyphicon glyphicon-remove',
        noEntityText: true,
        isDisabled: function() {
          return !$scope.abo || $scope.abo.guthaben > 0 || $scope.abo
            .anzahlLieferungen.length > 0 ||
            $scope.abo.anzahlAbwesenheiten.length > 0;
        },
        onExecute: function() {
          return $scope.abo.$delete();
        }
      }];



    }
  ]);
