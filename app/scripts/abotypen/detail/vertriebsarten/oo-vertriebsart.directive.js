'use strict';

angular.module('openolitor')
  .directive('ooVertriebsart', ['EnumUtil', 'VERTRIEBSARTEN', function(EnumUtil, VERTRIEBSARTEN) {
    return {
      replace: true,
      restrict: 'E',
      scope: {
        vertriebsart: '='
      },
      transclude: true,
      templateUrl: 'scripts/abotypen/detail/vertriebsarten/oo-vertriebsart.html',
      controller: function($scope) {
        $scope.vertriebsarten = EnumUtil.asArray(VERTRIEBSARTEN);

        // get data from backend
        $scope.depots = [{
          id: 'b31a839f-e0f0-4a1f-9c7e-ceb835f25e1f',
          name: 'Depot 1'
        }, {
          id: 'fbd78275-d7f6-48c0-8f92-b3c5ccb8924e',
          name: 'Depot 2'
        }];

        $scope.touren = [];

        $scope.isDepot = function() {
          return $scope.vertriebsart && VERTRIEBSARTEN.DEPOTLIEFERUNG === $scope.vertriebsart.typ;
        };

        $scope.isHeimlieferung = function() {
          return $scope.vertriebsart && VERTRIEBSARTEN.HEIMLIEFERUNG === $scope.vertriebsart.typ;
        };

        $scope.isPreselectionComplete = function() {
          return $scope.vertriebsart && $scope.vertriebsart.typ;
        };
      }
    };
  }]);
