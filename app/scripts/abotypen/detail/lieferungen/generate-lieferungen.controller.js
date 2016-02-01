'use strict';

/**
 */
angular.module('openolitor')
  .controller('GenerateLieferungenController', ['$scope', '$modalInstance','$log', 'abotyp', 'vertriebsart', 'von','moment','LIEFERZEITPUNKTE','LIEFERRHYTHMEN',

    function($scope, $modalInstance, $log, abotyp, vertriebsart, von, moment, LIEFERZEITPUNKTE,LIEFERRHYTHMEN) {
      $scope.von = von;
      $scope.initVon = von;
      $scope.abotyp = abotyp;
      $scope.lieferdaten = [];

      var liefertage = [];
      angular.forEach(LIEFERZEITPUNKTE, function(liefertag) {
          liefertage[liefertag.id] = liefertag.value;
      });

      $scope.ok = function () {
        $modalInstance.close($scope.lieferdaten);
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.deleteLieferdatum = function(lieferdatum) {
        var index = $scope.lieferdaten.indexOf(lieferdatum);
        if (index > -1) {
          $scope.lieferdaten.splice(index, 1);
        }
      };

      var generateLieferdaten = function() {
        if ($scope.von && $scope.bis) {
          var start = moment($scope.von);
          var end = moment($scope.bis);

          if (start.isAfter(end)) {
            return;
          }

          //berechne ersten liefertag liefertag basierend auf der vertriebsart
          var selectedWeekday = start.isoWeekday();
          var startingWeekday = liefertage[vertriebsart.liefertag];
          if (selectedWeekday <= startingWeekday) {
            //selektiere wochentag in derselben Woche
            start = start.isoWeekday(startingWeekday);
          }
          else {
            //selektiere Wochentag in der darauffolgenden Woche
            start = start.isoWeekday(startingWeekday+7);
          }

          //iteriere abhängig vom lierferrythmus
          var step;
          var stepEinheit;
          if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.WOECHENTLICH) {
            step = 1;
            stepEinheit = 'w';
          }
          else if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.ZWEIWOECHENTLICH) {
            step = 2;
            stepEinheit = 'w';
          }
          else if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.MONATLICH) {
            step = 1;
            stepEinheit = 'M';
          }
          else {
            //lieferdaten können nicht berechnet werden
            return;
          }

          $scope.lieferdaten = [];
          while (!start.isAfter(end)) {
            $scope.lieferdaten.push(start.valueOf());

            start = start.add(step, stepEinheit);
          }
        }
      };

      $scope.$watch('von', function(value) {
        if (value) {
          generateLieferdaten();
        }
      });

      $scope.$watch('bis', function(value) {
        if (value) {
          generateLieferdaten();
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
