'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbotypenDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'AbotypenDetailModel', 'LIEFERRHYTHMEN', 'PREISEINHEITEN', function($scope, $filter, $routeParams, $location, gettext, AbotypenDetailModel, LIEFERRHYTHMEN, PREISEINHEITEN) {

    var defaults = {
      model: {
        id: undefined,
        lieferrhythmus: LIEFERRHYTHMEN.WOECHENTLICH,
        preiseinheit: PREISEINHEITEN.JAHR,
        waehrung: 'CHF',
        aktiv: true,
        anzahlAbwesenheiten: 0
      }
    };

    $scope.lieferrhythmen = [];
    angular.forEach(LIEFERRHYTHMEN, function(value) {
      this.push({
        id: value,
        label: gettext(value)
      });
    }, $scope.lieferrhythmen);

    $scope.preiseinheiten = [];
    angular.forEach(PREISEINHEITEN, function(value) {
      this.push({
        id: value,
        label: gettext(value)
      });
    }, $scope.preiseinheiten);

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
      aktiv: true
    };

    if (!$routeParams.id) {
      $scope.abotyp = new AbotypenDetailModel(defaults.model);
    } else {
      AbotypenDetailModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.abotyp = result;
      });
    }

    $scope.isExisting = function() {
      return angular.isDefined($scope.abotyp) && angular.isDefined($scope.abotyp.id);
    };

    $scope.save = function() {
      $scope.abotyp.$save(function(result) {
        $location.path('/abotypen/' + result.id);
      });
    };

    $scope.cancel = function() {
      $location.path('/abotypen');
    };

    $scope.delete = function() {
      $scope.abotyp.$delete();
    };
  }]);
