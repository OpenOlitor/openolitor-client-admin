'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ArbeitsangebotDuplicateController', ['$scope', '$uibModalInstance',
    '$log', 'arbeitsangebot', 'moment', 'RHYTHMEN', 'EnumUtil',
    function($scope, $uibModalInstance, $log, arbeitsangebot, moment, RHYTHMEN, EnumUtil) {
      $scope.initVon = arbeitsangebot.zeitVon;
      $scope.von = arbeitsangebot.zeitVon;
      $scope.arbeitsangebot = arbeitsangebot;
      $scope.daten = [];

      $scope.rhythmen = EnumUtil.asArray(RHYTHMEN);
      $scope.rhythmus = RHYTHMEN.WOECHENTLICH;

      $scope.ok = function() {
        $uibModalInstance.close($scope.daten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.deleteDatum = function(datum) {
        var index = $scope.daten.indexOf(datum);
        if (index > -1) {
          $scope.daten.splice(index, 1);
        }
      };

      var generateDaten = function() {
        if ($scope.von && $scope.bis) {
          var start = moment($scope.von);
          var end = moment($scope.bis);

          if (start.isAfter(end)) {
            return;
          }

          var selectedWeekday = start.isoWeekday();
          var startingWeekday = moment($scope.initVon).isoWeekday();
          if (selectedWeekday <= startingWeekday) {
            //selektiere wochentag in derselben Woche
            start = start.isoWeekday(startingWeekday);
          } else {
            //selektiere Wochentag in der darauffolgenden Woche
            start = start.isoWeekday(startingWeekday + 7);
          }

          //iteriere abhängig vom lierferrythmus
          var step;
          var stepEinheit;
          if ($scope.rhythmus === RHYTHMEN.TAEGLICH) {
            step = 1;
            stepEinheit = 'd';
          } else if ($scope.rhythmus === RHYTHMEN.WOECHENTLICH) {
            step = 1;
            stepEinheit = 'w';
          } else if ($scope.rhythmus === RHYTHMEN.ZWEIWOECHENTLICH) {
            step = 2;
            stepEinheit = 'w';
          } else if ($scope.rhythmus === RHYTHMEN.MONATLICH) {
            step = 1;
            stepEinheit = 'M';
          } else {
            //date können nicht berechnet werden
            return;
          }

          $scope.daten = [];
          while (!start.isAfter(end)) {
            var date = new Date(start.valueOf());
            $scope.daten.push(date);

            start = start.add(step, stepEinheit);
          }
        }
      };

      $scope.$watch('von', function(value) {
        if (value) {
          generateDaten();
        }
      });

      $scope.$watch('bis', function(value) {
        if (value) {
          generateDaten();
        }
      });

      $scope.open = {
        von: false,
        vis: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };
    }
  ]);
