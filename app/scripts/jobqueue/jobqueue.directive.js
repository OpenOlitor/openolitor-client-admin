'use strict';

angular.module('openolitor-admin').directive('ooJobqueue', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      transclude: false,
      templateUrl: 'scripts/jobqueue/jobqueue.html',
      controller: 'JobqueueController'
    };
  }
]);
