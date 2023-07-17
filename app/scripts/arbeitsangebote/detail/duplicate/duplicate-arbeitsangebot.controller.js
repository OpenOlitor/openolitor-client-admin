'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ArbeitsangebotDuplicateController', ['$scope', '$uibModalInstance',
    '$log', 'arbeitsangebot', 'moment', 'RHYTHMEN', 'EnumUtil','lodash',
    function($scope, $uibModalInstance, $log, arbeitsangebot, moment, RHYTHMEN, EnumUtil, lodash) {
      $scope.initVon = arbeitsangebot.zeitVon;
      $scope.initBis = arbeitsangebot.zeitBis;
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

      $scope.isNotIrregular = function() {
        if ($scope.rhythmus === RHYTHMEN.UNREGELMAESSIG){
          return false;
        } else {
          return true;
        }
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
          if ($scope.rhythmus !== RHYTHMEN.TAEGLICH) {
            if (selectedWeekday <= startingWeekday) {
              //select weekday in the same week
              start = start.isoWeekday(startingWeekday);
            } else {
              //select weekday in the following week
              start = start.isoWeekday(startingWeekday + 7);
            }
          }

          //iterate depending on the distribution pace
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
            //date cannot be calculated
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

      var addDaten = function(value) {
        var date = new Date(value.valueOf());
        $scope.daten.push(date);
      }

      $scope.$watch('von', function(value) {
        if (value) {
          value.setHours($scope.initVon.getHours(),$scope.initVon.getMinutes(),$scope.initVon.getSeconds());
          generateDaten();
        }
      });

      $scope.$watch('bis', function(value) {
        if (value) {
          value.setHours($scope.initBis.getHours(),$scope.initBis.getMinutes(),$scope.initBis.getSeconds());
          generateDaten();
        }
      });


      $scope.$watch('irregular', function(value) {
        if (value) {
          var alreadyPlanned = false;
          lodash.forEach($scope.daten, function(date){
            if (date.getTime() === value.getTime()) {
              alreadyPlanned = true;
            }
          });

          if (!alreadyPlanned){
            addDaten(value.setHours($scope.initVon.getHours(),$scope.initVon.getMinutes(),$scope.initVon.getSeconds()));
          }
        }
      });

      $scope.open = {
        von: false,
        bis: false,
        irregular: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };
    }
  ]);
