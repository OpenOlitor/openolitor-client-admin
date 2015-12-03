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
          id: 123,
          name: 'Depot 1'
        }, {
          id: 321,
          name: 'Depot 2'
        }];

        $scope.touren = [];

        $scope.isDepot = function() {
          return $scope.vertriebsart && VERTRIEBSARTEN.DEPOTLIEFERUNG === $scope.vertriebsart.identifier;
        };

        $scope.isHeimlieferung = function() {
          return $scope.vertriebsart && VERTRIEBSARTEN.HEIMLIEFERUNG === $scope.vertriebsart.identifier;
        };

        $scope.isPreselectionComplete = function() {
          return $scope.vertriebsart && $scope.vertriebsart.identifier;
        };
      }
    };
  }]);
