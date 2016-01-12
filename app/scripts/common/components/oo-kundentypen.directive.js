'use strict';

angular.module('openolitor').directive('ooKundentypen', ['EnumUtil', 'KUNDENTYPEN', function(EnumUtil, KUNDENTYPEN) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      kundentypenList: '='
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-kundentypen.directive.html',
    controller: function($scope) {
      $scope.kundentypen = EnumUtil.asArray(KUNDENTYPEN);

      $scope.selectedKundentypen = {};

      // initialize the set kundentypen
      var deregister = $scope.$watchCollection('kundentypenList', function() {
        if ($scope.kundentypenList && $scope.kundentypenList.length > 0) {
          angular.forEach($scope.kundentypenList, function(id) {
            $scope.selectedKundentypen[id] = true;
          });
          deregister();
        }
      });

      $scope.$watchCollection('selectedKundentypen', function() {
        $scope.kundentypenList = [];
        angular.forEach($scope.selectedKundentypen, function(value, id) {
          if (value) {
            $scope.kundentypenList.push(id);
          }
        });
      });
    }
  };
}]);
