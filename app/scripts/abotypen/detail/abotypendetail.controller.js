'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbotypenDetailController', ['$scope', '$filter', '$routeParams',
    '$location', 'gettext', 'ngTableParams', 'AbotypenDetailModel',
    'LIEFERRHYTHMEN',
    'PREISEINHEITEN', 'LAUFZEITEINHEITEN', 'EnumUtil',
    function($scope, $filter, $routeParams, $location, gettext, ngTableParams,
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

      $scope.dummyLieferungen = [{
        datum: '31.01.2016',
        anzahlAbwesenheiten: 0,
        anzahlAbos: 135,
        status: 'Geplant'
      }, {
        datum: '15.02.2016',
        anzahlAbwesenheiten: 2,
        anzahlAbos: 130,
        status: 'Offen'
      }, ];

      $scope.lieferungen = $scope.dummyLieferungen;

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

      $scope.hasLieferungen = function() {
        return $scope.lieferungen !== undefined;
      };

      if (!$scope.lieferungenTableParams) {
        //use default tableParams
        $scope.lieferungenTableParams = new ngTableParams({ // jshint ignore:line
          counts: [],
          sorting: {
            name: 'asc'
          }
        }, {
          getData: function($defer, params) {
            if (!$scope.lieferungen) {
              return;
            }
            params.total($scope.lieferungen.length);
            $defer.resolve($scope.lieferungen);
          }

        });
      }

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
