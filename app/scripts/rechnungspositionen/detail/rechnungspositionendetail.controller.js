'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('RechnungsPositionDetailController', ['$scope', '$rootScope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'RechnungsPositionenModel', 'KundenDetailModel', 'RECHNUNGSPOSITIONSSTATUS',
    'moment', 'EnumUtil', 'DetailNavigationService',

    function($scope, $rootScope, $filter, $routeParams, $location, $route, $uibModal,
      $log, $http, gettext,
      RechnungsPositionenModel, KundenDetailModel, RECHNUNGSPOSITIONSSTATUS,
      moment, EnumUtil, DetailNavigationService) {
      $rootScope.viewId = 'D-Repo';

      DetailNavigationService.cleanKundeList();
      $scope.rechnungsPositionenStatus = EnumUtil.asArray(RECHNUNGSPOSITIONSSTATUS);

      function resolveKunde(id) {
        return KundenDetailModel.get({
          id: id
        }, function(kunde) {
          $scope.kunde = kunde;
        }).$promise;
      }

      $scope.$watch('rechnungsPosition', function(pos) {
          resolveKunde(pos.kundeId);
      });

      $scope.loading = false;

      $scope.actions = [{
        label: gettext('Speichern'),
        noEntityText: true,
        isDisabled: function() {
          return $scope.rechnungsPosition.status !== 'Offen';
        },
        onExecute: function() {
          return $scope.rechnungsPosition.$save();
        }
      }];
    }
  ]);
