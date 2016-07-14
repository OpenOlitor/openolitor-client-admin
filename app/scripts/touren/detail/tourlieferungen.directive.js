'use strict';

angular.module('openolitor').directive('ooTourlieferungen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        itemFilter: '=',
        tour: '='
      },
      transclude: true,
      templateUrl: 'scripts/touren/detail/tourlieferungen.html'
    };
  }
]);
