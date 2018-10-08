'use strict';

/**
 */
angular
  .module('openolitor-admin')
  .controller('AbosOverviewCreateRechnungsPositionenController', [
    '$scope',
    '$filter',
    '$routeParams',
    '$location',
    '$route',
    '$uibModal',
    '$log',
    '$http',
    'gettext',
    'moment',
    'EnumUtil',
    'DataUtil',
    'msgBus',
    '$q',
    'lodash',
    'API_URL',
    'alertService',
    'AbosOverviewService',
    'ZusatzabosOverviewService',
    'ooAuthService',

    function(
      $scope,
      $filter,
      $routeParams,
      $location,
      $route,
      $uibModal,
      $log,
      $http,
      gettext,
      moment,
      EnumUtil,
      DataUtil,
      msgBus,
      $q,
      _,
      API_URL,
      alertService,
      AbosOverviewService,
      ZusatzabosOverviewService,
      ooAuthService
    ) {
      $scope.rechnungsPositionen = {
        waehrung: 'CHF'
      };

      $scope.form = {
        mode: 'AnzahlLieferungen',
        manuellerBetrag: false
      };

      $scope.batchCreated = {
        ids: [],
        openAboIds: $scope.aboIds
      };

      $scope.commandIssued = false;

      $scope.open = {
        start: false
      };

      $scope.batchCreate = function() {
        $scope.user = ooAuthService.getUser();
        $scope.rechnungsPositionen.ids = $scope.aboIds;
        var service =
          $scope.aboType === 'zusatzabos'
            ? ZusatzabosOverviewService
            : AbosOverviewService;
        switch ($scope.form.mode) {
          case 'AnzahlLieferungen':
            service
              .createAnzahlLieferungenRechnungsPositionen(
                $scope.rechnungsPositionen
              )
              .then(
                function() {
                  $scope.commandIssued = true;
                  $scope.createHasWorked = true;
                },
                function() {
                  $scope.commandIssued = true;
                  $scope.createHasWorked = false;
                  console.log('AnzahlLieferungen error');
                }
              );
            break;
          case 'BisGuthaben':
            service
              .createBisGuthabenRechnungsPositionen($scope.rechnungsPositionen)
              .then(
                function() {
                  $scope.commandIssued = true;
                  $scope.createHasWorked = true;
                },
                function() {
                  $scope.commandIssued = true;
                  console.log('BisGuthaben error');
                  $scope.createHasWorked = false;
                }
              );
            break;
        }
      };

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.jumpToRechnungspositionen = function() {
        $location
          .path('/rechnungspositionen')
          .search({ q: 'id=' + $scope.batchCreated.ids.join() });
      };

      $scope.jumpToAbosWhereCreateHasFailed = function() {
        $scope.filterQuery = 'id=' + $scope.batchCreated.openAboIds.join();
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'RechnungsPosition') {
          if ($scope.user.id === msg.data.modifikator) {
            $scope.batchCreated.ids.push(msg.data.id);
            _.pull($scope.batchCreated.openAboIds, msg.data.aboId);
            $scope.$apply();
          }
        }
      });
    }
  ]);
