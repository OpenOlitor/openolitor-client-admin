'use strict';

/**
 */
angular.module('openolitor')
  .controller('NgTableExportController', ['$scope', '$element', 'exportTable',
    function($scope, $element, exportTable) {
      $scope.showExport = false;
      var fileName = 'Export';
      var idToExport = '';
      if(angular.isDefined($element.parent().parent().parent().parent())) {
        idToExport = $element.parent().parent().parent().parent().attr('id');
        fileName = $element.parent().parent().parent().parent().attr('export-file-name');
        $scope.showExport = $element.parent().parent().parent().parent().attr('display-export');
      }
      $scope.exportData = function() {
        exportTable($element.parent().parent().parent().parent(), fileName + '.xlsx');
      };

    }
  ]
);
