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
      }];
    }
  ]);
