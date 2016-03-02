'use strict';

/**
 */
angular.module('openolitor')
  .controller('OpenOlitorRootController', ['$scope', 'ProjektModel', '$location', 'checkSize', '$window', 'BUILD_NR',
  function($scope, ProjektModel, $location, checkSize, $window, BUILD_NR) {
    angular.element($window).bind('resize', function() {
      checkSize();
    });

    $scope.currentPathContains = function(pathJunk) {
      return $location.url().indexOf(pathJunk) !== -1;
    };

    //initial launch
    checkSize();

    $scope.projekt = ProjektModel.query({});

    $scope.buildNr = BUILD_NR;

  }]);
