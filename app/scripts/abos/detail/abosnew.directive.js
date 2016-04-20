'use strict';

angular.module('openolitor').directive('ooAbosNew', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        kundeId: '=',
        onSave: '&',
        onCancel: '&'
      },
      transclude: true,
      templateUrl: 'scripts/abos/detail/create-abo.html',
      controller: 'AbosDetailController'
    };
  }
]);
