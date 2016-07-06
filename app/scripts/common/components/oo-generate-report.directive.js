'use strict';

angular.module('openolitor').directive('ooGenerateReport', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      postPath: '=',
      onGenerated: '&',
      onClose: '&',
      defaultFileName: '=',
      ids: '=?'
    },
    templateUrl: 'scripts/common/components/oo-generate-report.directive.html',
    controller: function($scope, $http, API_URL, FileUtil, gettext) {
      $scope.form = {
        vorlage: undefined,
        pdfGenerieren: true,
        pdfAblegen: false,
        pdfDownloaden: true
      };

      var generateWithFormData = function(formData) {
        $scope.error = undefined;
        $http.post(API_URL + $scope.postPath, formData, {
          //IMPORTANT!!! You might think this should be set to 'multipart/form-data'
          // but this is not true because when we are sending up files the request
          // needs to include a 'boundary' parameter which identifies the boundary
          // name between parts in this multi-part request and setting the Content-type
          // manually will not set this boundary parameter. For whatever reason,
          // setting the Content-type to 'false' will force the request to automatically
          // populate the headers properly including the boundary parameter.
          headers: {
            'Content-Type': undefined
          },
          // angular.identity prevents Angular to do anything on our data (like serializing it).
          transformRequest: angular.identity,
          responseType: 'arraybuffer'
        }).then(function(res) {
          var name = res.headers('Content-Disposition');
          var contentType = res.headers('Content-Type');
          FileUtil.open(name || $scope.defaultFileName, res.data,
            contentType);
          $scope.generating = false;
          $scope.onGenerated()();
        }, function(response) {
          console.log('Failed generating report', response);
          $scope.generating = false;
          $scope.error = gettext(
            'Bericht konnte nicht erzeugt werden');
        });
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
        if ($scope.ids && angular.isArray($scope.ids)) {
          fd.append('ids', $scope.ids.toString());
        }
        $scope.generating = true;
        generateWithFormData(fd);
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
