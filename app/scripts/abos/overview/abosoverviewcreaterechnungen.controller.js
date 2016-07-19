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
      moment, EnumUtil, DataUtil, msgBus, $q, _, API_URL,
      alertService, AbosOverviewService) {

      $scope.rechnung = {
        ids: $scope.aboIds,
        waehrung: 'CHF',
        rechnungsDatum: new Date(),
        faelligkeitsDatum: new Date(moment().add(1, 'month').subtract(1,
          'day').valueOf())
      };

      $scope.form = {
        mode: 'AnzahlLieferungen',
        manuellerBetrag: false
      };

      $scope.batchCreated = {
        ids: []
      };

      $scope.commandIssued = false;

      $scope.open = {
        start: false
      };

      $scope.batchCreate = function() {
        switch($scope.form.mode) {
          case 'AnzahlLieferungen':
            AbosOverviewService.createAnzahlLieferungenRechnungen($scope.rechnung).then(function() {
              $scope.commandIssued = true;
            });
            break;
          case 'BisGuthaben':
             AbosOverviewService.createBisGuthabenRechnungen($scope.rechnung).then(function() {
              $scope.commandIssued = true;
            });
            break;
        }
      };

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.jumpToRechnungen = function() {
        $location.path('/rechnungen').search('q', 'id=' + $scope.batchCreated.ids.join());
      };
      
      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'Rechnung') {
          if(_.includes($scope.rechnung.ids, msg.data.aboId)) {
            $scope.batchCreated.ids.push(msg.data.id);
            $scope.$apply();
          }
        }
      });
    }
  ]);
