'use strict';

/**
 */
angular.module('openolitor')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams', '$location', 'gettext', 'AbosDetailModel', 'AbotypenOverviewModel', 'AbotypenDetailModel', 'PersonenDetailModel', 'VERTRIEBSARTEN', function($scope, $filter, $routeParams, $location, gettext, AbosDetailModel, AbotypenOverviewModel, AbotypenDetailModel, PersonenDetailModel, VERTRIEBSARTEN) {

    $scope.VERTRIEBSARTEN = VERTRIEBSARTEN;

    var defaults = {
      model: {
        id: undefined,
        abotypId: undefined
      }
    };

    var basePath = '/abos';
    if ($routeParams.personId) {
      basePath = '/personen/' + $routeParams.personId + basePath;
    }

    if (!$routeParams.id) {
      PersonenDetailModel.get({
        id: $routeParams.personId
      }, function(person) {
        $scope.person = person;
        $scope.abo = new AbosDetailModel(defaults.model);
        $scope.abo.personId = $scope.person.id;
        $scope.abo.personName = $scope.person.name;
        $scope.abo.personVorname = $scope.person.vorname;
      });
    } else {
      PersonenDetailModel.get({
        id: $routeParams.personId
      }, function(person) {
        $scope.person = person;
      });

      AbosDetailModel.get({
        id: $routeParams.id,
        personId: $routeParams.personId
      }, function(result) {
        $scope.abo = result;
      });
    }

    $scope.abotypen = AbotypenOverviewModel.query({
      aktiv: true
    });

    $scope.isExisting = function() {
      return angular.isDefined($scope.abo) && angular.isDefined($scope.abo.id);
    };

    $scope.save = function() {
      $scope.abo.$save();
    };

    $scope.created = function(id) {
      $location.path(basePath + '/' + id);
    };

    $scope.cancel = function() {
      $location.path(basePath);
    };

    $scope.delete = function() {
      $scope.abo.$delete();
    };

    // TODO introduce a generic way
    function vertriebsartLabel(vertriebsart) {
      switch (vertriebsart.typ) {
        case VERTRIEBSARTEN.DEPOTLIEFERUNG:
          return vertriebsart.typ + ' - ' + vertriebsart.depot.name;
        case VERTRIEBSARTEN.HEIMLIEFERUNG:
          return vertriebsart.typ + ' - ' + vertriebsart.tour.name;
        default:
          return vertriebsart.typ;
      }
    }

    function createPermutations(abotyp) {
      $scope.vertriebsartPermutations = [];
      angular.forEach(abotyp.vertriebsarten, function(vertriebsart) {
        $scope.vertriebsartPermutations.push({
          label: vertriebsartLabel(vertriebsart),
          vertriebsart: vertriebsart
        });
        if ($scope.isExisting() && vertriebsart.depot.id === $scope.abo.depotId) {
          $scope.abo.vertriebsart = vertriebsart;
        }
      });
    }

    $scope.$watch('abo.abotypId', function(abotypId) {
      if (abotypId) {
        AbotypenDetailModel.get({
          id: abotypId
        }, function(abotyp) {
          $scope.abotyp = abotyp;
          $scope.abo.abotypName = abotyp.name;
          createPermutations($scope.abotyp);
        });
      }
    });

    $scope.$watch('abo.vertriebsart', function(vertriebsart) {
      if (vertriebsart) {
        switch (vertriebsart.typ) {
          case VERTRIEBSARTEN.DEPOTLIEFERUNG:
            $scope.abo.depotId = vertriebsart.depot.id;
            $scope.abo.depotName = vertriebsart.depot.name;
            break;
          case VERTRIEBSARTEN.HEIMLIEFERUNG:
            $scope.abo.tourId = vertriebsart.tour.id;
            $scope.abo.tourName = vertriebsart.tour.name;
            break;
        }
      }
    });
  }]);
