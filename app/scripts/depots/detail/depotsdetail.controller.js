'use strict';

/**
 */
angular.module('openolitor')
  .controller('DepotsDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'DepotsDetailModel', function($scope, $filter, $routeParams, $location, gettext, DepotsDetailModel) {

    var defaults = {
      model: {
        id: undefined
      }
    };

    // dummy entry
    $scope.dummyEntry = {
      id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
      name: 'Tingel-Kringel',
      apName: 'Tree',
      apVorname: 'Joshua',
      apTelefon: '079 666 99 99',
      apMail: 'apDepotX@openolitor.ch',
      vName: 'Baumann',
      vVorname: 'Julie',
      vTelefon: '079 666 99 98',
      vMail: 'vDepotX@openolitor.ch',
      strasse: 'Mittelstrasse',
      hausNummer: '99',
      plz: 3012,
      ort: 'Bern',
      anzahlAbonnenten: 1,
      anzahlAbonnentenMax: 10,
      aktiv: true,
      oeffnungszeiten: 'Mi: 12-19h, Do-Sa, 8-19h',
      iban: 'CH12 1282 1231 1321 1',
      bank: 'Post oder Bank, 3000 Bern',
      beschreibung: 'Dies sind erstmal nur Testdaten'
    };

    if (!$routeParams.id || $routeParams.id === 'new') {
      $scope.depot = new DepotsDetailModel(defaults.model);
    } else {
      DepotsDetailModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.depot = result;
      });
      //$scope.depot = $scope.dummyEntry;
    }

    $scope.isExisting = function() {
      return angular.isDefined($scope.depot) && angular.isDefined($scope.depot.id);
    };

    $scope.save = function() {
      $scope.depot.$save(function(result) {
        if (!$scope.isExisting()) {
          $location.path('/depots/' + result.id);
        }
      });
    };

    $scope.cancel = function() {
      $location.path('/depots');
    };

    $scope.delete = function() {
      $scope.depot.$delete();
    };
  }]);
