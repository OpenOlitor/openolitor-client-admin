'use strict';

angular.module('openolitor')
  .directive('ooVertriebsarten', ['VERTRIEBSARTEN', function(VERTRIEBSARTEN) {
    return {
      replace: true,
      restrict: 'E',
      transclude: true,
      templateUrl: 'scripts/abotypen/detail/vertriebsarten/oo-vertriebsarten.html',
      controller: function($scope) {
        $scope.addVertriebsart = function() {
          $scope.abotyp.vertriebsarten.push({
            identifier: VERTRIEBSARTEN.DEPOTLIEFERUNG
          });
        };

        $scope.removeVertriebsart = function(index) {
          $scope.abotyp.vertriebsarten.splice(index, 1);
        };
      }
    };
  }]);
