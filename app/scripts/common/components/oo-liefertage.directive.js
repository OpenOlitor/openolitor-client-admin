'use strict';

angular.module('openolitor').directive('ooLiefertage', ['EnumUtil',
  'LIEFERZEITPUNKTE',
  function(EnumUtil, LIEFERZEITPUNKTE) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        liefertag: '=',
        required: '='
      },
      transclude: true,
      templateUrl: 'scripts/common/components/oo-liefertage.directive.html',
      controller: function($scope) {
        $scope.liefertage = EnumUtil.asArray(LIEFERZEITPUNKTE);

        $scope.isSelected = function(liefertag) {
          return ($scope.liefertag && $scope.liefertag === liefertag.id) ?
            'active' : '';
        };

        $scope.selectedLiefertag = function(liefertag) {
          $scope.liefertag = liefertag.id;
        };
      }
    };
  }
]);
