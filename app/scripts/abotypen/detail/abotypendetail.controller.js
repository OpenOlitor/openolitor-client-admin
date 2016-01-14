'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbotypenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'AbotypenDetailModel', 'LIEFERRHYTHMEN',
    'PREISEINHEITEN', 'LAUFZEITEINHEITEN', 'EnumUtil',
    function($scope, $filter, $routeParams, $location, gettext,
      AbotypenDetailModel, LIEFERRHYTHMEN, PREISEINHEITEN, LAUFZEITEINHEITEN,
      EnumUtil) {

      var defaults = {
        model: {
          id: undefined,
          lieferrhythmus: LIEFERRHYTHMEN.WOECHENTLICH,
          preiseinheit: PREISEINHEITEN.JAHR,
          laufzeiteinheit: LAUFZEITEINHEITEN.MONATE,
          waehrung: 'CHF',
          anzahlAbwesenheiten: undefined,
          farbCode: '',
          aktiv: 1,
          vertriebsarten: [{
            typ: 'Depotlieferung'
          }]
        }
      };

      $scope.open = {
        aktivVon: false,
        aktivBis: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.lieferrhythmen = EnumUtil.asArray(LIEFERRHYTHMEN);

      $scope.preiseinheiten = EnumUtil.asArray(PREISEINHEITEN);

      $scope.laufzeiteinheiten = EnumUtil.asArray(LAUFZEITEINHEITEN);

      // dummy entry
      $scope.dummyEntry = {
        id: 'c8926129-045d-4f78-9c79-0ee873aed785',
        name: 'abo1',
        anzahlAbonnenten: 12,
        letzteLieferung: '2015-10-30T18:21Z',
        lieferrhythmus: 'Zweiwoechentlich',
        preis: 20,
        preiseinheit: 'Lieferung',
        waehrung: 'CHF',
        aktiv: true,
        vertriebsarten: [{
          typ: 'Depotlieferung'
        }]
      };

      $scope.abotypStyle = {};

      if (!$routeParams.id) {
        $scope.abotyp = new AbotypenDetailModel(defaults.model);
      } else {
        AbotypenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.abotyp = result;
        });
      }

      $scope.$watch('abotyp.farbCode', function(newValue) {
        if (newValue) {
          $scope.abotypStyle = {
            'background-color': $scope.abotyp.farbCode
          }
        }
      });

      $scope.isExisting = function() {
        return angular.isDefined($scope.abotyp) && angular.isDefined($scope
          .abotyp.id);
      };

      $scope.save = function() {
        return $scope.abotyp.$save();
      };

      $scope.backToList = function() {
        $location.path('/abotypen');
      };

      $scope.created = function(id) {
        $location.path('/abotypen/' + id);
      };

      $scope.delete = function() {
        return $scope.abotyp.$delete();
      };
    }
  ]);
