'use strict';

angular.module('openolitor').directive('ooGenerateReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      onGenerate: '&',
      onClose: '&'
    },
    templateUrl: 'scripts/common/components/oo-generate-report.directive.html',
    controller: function($scope) {
      $scope.form = {
        vorlage: undefined,
        pdfGenerieren: true,
        pdfAblegen: undefined,
        pdfDownloaden: undefined
      };

      $scope.generate = function() {
        var fd = new FormData();
        //add dummy parameter to create correct multipart request on empty form data
        fd.append('report', true);
        for (var key in $scope.form) {
          if ($scope.form[key]) {
            fd.append(key, $scope.form[key]);
          }
        }
        $scope.onGenerate()(fd);
      };

      $scope.selectStandardVorlage = function() {
        $scope.form.vorlage = undefined;
      };

      $scope.selectFile = function(file) {
        if (file) {
          $scope.form.vorlage = file;
        }
      };
    }
  };
});
