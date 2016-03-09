'use strict';

/**
 */
angular.module('openolitor')
  .controller('OpenOlitorRootController', ['$scope', 'ServerModel', 'ProjektModel', 'gettextCatalog', '$location', 'checkSize', '$window', '$timeout', 'BUILD_NR',
  function($scope, ServerModel, ProjektModel, gettextCatalog, $location, checkSize, $window, $timeout, BUILD_NR) {
    angular.element($window).bind('resize', function() {
      checkSize();
    });

    $scope.currentPathContains = function(pathJunk) {
      return $location.url().indexOf(pathJunk) !== -1;
    };

    //initial launch
    checkSize();

    $scope.projekt = ProjektModel.query({});

    $scope.serverInfo = ServerModel.query({});

    $scope.buildNr = BUILD_NR;

    $timeout(function() {
      $scope.menushow[angular.element( '.sidebar-nav .active' ).parent().attr('activate-id')] = true;
    }, 0);

    $scope.changeLang = function(lang) {
      if (!angular.isUndefined(lang)) {
        gettextCatalog.setCurrentLanguage(lang);
        $scope.$emit('languageChanged');
      }
    };

    $scope.activeLang = function() {
      return gettextCatalog.getCurrentLanguage();
    };

    if ($scope.activeLang() !== 'de' || $scope.activeLang() !== 'fr') {
      $scope.changeLang('de');
    }

  }]);
