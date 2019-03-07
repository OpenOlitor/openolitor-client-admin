'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('BestellungenAbrechnenController', ['$scope', '$rootScope',
    'EinkaufsrechnungenOverviewService', 'msgBus', 'lodash',

    function($scope, $rootScope, EinkaufsrechnungenOverviewService, msgBus, lodash) {
      $rootScope.viewId = 'D-Eink';

      $scope.bestellungenAbrechnen = {
        ids: $scope.bestellungIds,
        datum: new Date()
      };

      $scope.form = {
        mode: 'AnzahlLieferungen',
        manuellerBetrag: false
      };

      $scope.batchModified = {
        ids: []
      };

      $scope.commandIssued = false;
      $scope.commandFinished = false;

      $scope.open = {
        start: false
      };

      $scope.finished = function() {
        $scope.commandIssued = false;
        $scope.commandFinished = false;
        $scope.onClose()();
      };

      $scope.batchModify = function() {
        $scope.bestellungenAbrechnen.ids = $scope.bestellungIds;
        EinkaufsrechnungenOverviewService.alsAbgerechnetMarkieren(
          $scope.bestellungenAbrechnen).then(function() {
          $scope.commandIssued = true;
        });
      };

      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'Sammelbestellung') {
          if (lodash.includes($scope.bestellungIds, msg.data.id)) {
            $scope.batchModified.ids.push(msg.data.id);
            if ($scope.batchModified.ids.length === $scope.bestellungIds.length) {
              $scope.commandFinished = true;
            }
            $scope.$apply();
          }
        }
      });
    }
  ]);
