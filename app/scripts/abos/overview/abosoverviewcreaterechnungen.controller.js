'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosOverviewCreateRechnungenController', ['$scope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'moment', 'EnumUtil', 'DataUtil', 'msgBus', '$q', 'lodash',
    'API_URL', 'alertService', 'AbosOverviewService',

    function($scope, $filter, $routeParams, $location, $route, $uibModal,
      $log, $http, gettext,
      moment, EnumUtil, DataUtil, msgBus, $q, lodash, API_URL,
      alertService, AbosOverviewService) {

      $scope.rechnung = {
        ids: $scope.aboIds,
        waehrung: 'CHF',
        rechnungsDatum: new Date(),
        faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1,
          'day').valueOf())
      };

      $scope.open = {
        start: false
      };
      
      $scope.actions = [{
        labelFunction: function() {
          return 'Rechnungen erstellen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          return AbosOverviewService.createAnzahlLieferungenRechnungen($scope.rechnung);
        }
      }];

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.cancel = function() {
        $location.path(basePath);
      };
    }
  ]);
