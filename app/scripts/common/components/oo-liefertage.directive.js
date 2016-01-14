'use strict';

angular.module('openolitor').directive('ooLiefertage', ['EnumUtil',
  'LIEFERZEITPUNKTE',
  function(EnumUtil, LIEFERZEITPUNKTE) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        liefertageList: '=',
        required: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-liefertage.directive.html',
      controller: function($scope) {
        $scope.liefertage = EnumUtil.asArray(LIEFERZEITPUNKTE);

        $scope.selectedLiefertage = {};

        // initialize the set liefertage
        var deregister = $scope.$watchCollection('liefertageList',
          function() {
            if ($scope.liefertageList && $scope.liefertageList.length >
              0) {
              angular.forEach($scope.liefertageList, function(id) {
                $scope.selectedLiefertage[id] = true;
              });
              deregister();
            }
          });

        $scope.$watchCollection('selectedLiefertage', function() {
          $scope.liefertageList = [];
          angular.forEach($scope.selectedLiefertage, function(value,
            id) {
            if (value) {
              $scope.liefertageList.push(id);
            }
          });
        });
      }
    };
  }
]);
