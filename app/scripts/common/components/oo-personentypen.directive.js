'use strict';

angular.module('openolitor').directive('ooPersonentypen', ['EnumUtil', 'PERSONENTYPEN', function(EnumUtil, PERSONENTYPEN) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      personentypenList: '='
    },
    transclude: true,
    templateUrl: 'scripts/common/components/oo-personentypen.directive.html',
    controller: function($scope) {
      $scope.personentypen = EnumUtil.asArray(PERSONENTYPEN);

      $scope.selectedPersonentypen = {};

      // initialize the set personentypen
      var deregister = $scope.$watchCollection('personentypenList', function() {
        if ($scope.personentypenList && $scope.personentypenList.length > 0) {
          angular.forEach($scope.personentypenList, function(id) {
            $scope.selectedPersonentypen[id] = true;
          });
          deregister();
        }
      });

      $scope.$watchCollection('selectedPersonentypen', function() {
        $scope.personentypenList = [];
        angular.forEach($scope.selectedPersonentypen, function(value, id) {
          if (value) {
            $scope.personentypenList.push(id);
          }
        });
      });
    }
  };
}]);
