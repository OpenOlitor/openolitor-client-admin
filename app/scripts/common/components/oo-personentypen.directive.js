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

      angular.forEach($scope.personentypenList, function(id) {
        $scope.selectedPersonentypen[id] = true;
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
