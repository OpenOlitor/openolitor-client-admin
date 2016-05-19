'use strict';

/**
 */
angular.module('openolitor')
  .controller('GenerateLieferungenController', ['$scope', '$uibModalInstance',
    '$log', 'abotyp', 'vertrieb', 'von', 'moment', 'lieferungen',
    'LIEFERZEITPUNKTE',
    'LIEFERRHYTHMEN',

    function($scope, $uibModalInstance, $log, abotyp, vertrieb, von, moment,
      lieferungen,
      LIEFERZEITPUNKTE, LIEFERRHYTHMEN) {
      $scope.von = von;
      $scope.initVon = von;
      $scope.abotyp = abotyp;
      $scope.lieferdaten = [];
      $scope.lieferungen = lieferungen;

      var liefertage = [];
      angular.forEach(LIEFERZEITPUNKTE, function(liefertag) {
        liefertage[liefertag.id] = liefertag.value;
      });

      $scope.ok = function() {
        $uibModalInstance.close($scope.lieferdaten);
      };

      $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.deleteLieferdatum = function(lieferdatum) {
        var index = $scope.lieferdaten.indexOf(lieferdatum);
        if (index > -1) {
          $scope.lieferdaten.splice(index, 1);
        }
      };

      var datumExistiert = function(datum) {
        //first check if date if not yet part of the list of lieferdat. Lieferdat must be unique
        var result = false;
        angular.forEach($scope.lieferungen, function(lieferung) {
          if (lieferung.datum.toDateString() === datum.toDateString()) {
            result = true;
            return;
          }
        });
        return result;
      };

      var generateLieferdaten = function() {
        if ($scope.von && $scope.bis) {
          var start = moment($scope.von);
          var end = moment($scope.bis);

          if (start.isAfter(end)) {
            return;
          }

          //berechne ersten liefertag liefertag basierend auf der vertrieb
          var selectedWeekday = start.isoWeekday();
          var startingWeekday = liefertage[vertrieb.liefertag];
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
          if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.WOECHENTLICH) {
            step = 1;
            stepEinheit = 'w';
          } else if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.ZWEIWOECHENTLICH) {
            step = 2;
            stepEinheit = 'w';
          } else if (abotyp.lieferrhythmus === LIEFERRHYTHMEN.MONATLICH) {
            //wie sollen lieferdaten für monatliche Lieferungen berechnet werden? 1. Liefertag im Monat?
            return;
          } else {
            //lieferdaten können nicht berechnet werden
            return;
          }

          $scope.lieferdaten = [];
          while (!start.isAfter(end)) {
            var date = new Date(start.valueOf());
            if (!datumExistiert(date)) {
              $scope.lieferdaten.push(date);
            }

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
