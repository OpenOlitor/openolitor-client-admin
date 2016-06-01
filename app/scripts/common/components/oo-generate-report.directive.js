'use strict';

angular.module('openolitor').directive('ooGenerateReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      onGenerate: '&',
      onClose: '&'
    },
    templateUrl: 'scripts/common/components/oo-dropdown.directive.html',
    controller: function($scope) {
      $scope.form = {
        vorlage: undefined,
        pdfGenerieren: true,
        pdfAblegen: undefined,
        pdfDownloaden: undefined
      };

      $scope.generate = function() {
        var fd = new FormData();
        for (var key in $scope.form) {
            fd.append(key, $scope.form[key]);
        }
        $scope.onGenerate(fd);
      };
    }
  };
});
