'use strict';

angular.module('openolitor-admin').directive('ooTourlieferungen', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        itemFilter: "=",
        tourlieferungen: "=",
        unsortedTourlieferungen: "@",
        sortedTourlieferungen: "@"
      },
      transclude: true,
      templateUrl: 'scripts/touren/detail/tourlieferungen.html',
      controller: 'TourenDetailController'
    };
  }
]);
