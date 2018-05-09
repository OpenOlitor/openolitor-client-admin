'use strict';

angular.module('openolitor-admin').directive('ooMailVorlagen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        typ: '='
      },
      transclude: false,
      templateUrl: 'scripts/mailvorlagen/mailvorlagen.html',
      controller: 'MailvorlagenController'
    };
  }
]);
