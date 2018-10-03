'use strict';

angular.module('openolitor-admin').directive('ooReportVorlagen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        vorlagen: '=',
        typ: '='
      },
      transclude: false,
      templateUrl: 'scripts/reportvorlagen/reportvorlagen.html',
      controller: 'ReportvorlagenController'
    };
  }
]);
