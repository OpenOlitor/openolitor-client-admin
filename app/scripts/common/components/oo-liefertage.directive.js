'use strict';

angular.module('openolitor').directive('ooLiefertage', ['EnumUtil', 'LIEFERZEITPUNKTE', function(EnumUtil, LIEFERZEITPUNKTE) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      liefertageList: '='
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-liefertage.directive.html',
    controller: function($scope) {
      $scope.liefertage = EnumUtil.asArray(LIEFERZEITPUNKTE);

      $scope.selectedLiefertage = {};

      angular.forEach($scope.liefertageList, function(id) {
        $scope.selectedLiefertage[id] = true;
      });

      $scope.$watchCollection('selectedLiefertage', function() {
        $scope.liefertageList = [];
        angular.forEach($scope.selectedLiefertage, function(value, id) {
          if (value) {
            $scope.liefertageList.push(id);
          }
        });
      });
    }
  };
}]);
