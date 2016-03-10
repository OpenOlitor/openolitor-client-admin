'use strict';

/**
 */
angular.module('openolitor')
  .controller('OpenOlitorRootController', ['$scope', 'ServerService', 'ProjektModel', 'gettextCatalog', '$location', 'checkSize', '$window', '$timeout', 'BUILD_NR',
  function($scope, ServerService, ProjektModel, gettextCatalog, $location, checkSize, $window, $timeout, BUILD_NR) {
    angular.element($window).bind('resize', function() {
      checkSize();
    });

    $scope.currentPathContains = function(pathJunk) {
      return $location.url().indexOf(pathJunk) !== -1;
    };

    //initial launch
    checkSize();

    $scope.connected = false;

    $scope.projekt = ProjektModel.query({});

    $scope.$watch(ServerService.getStaticServerInfo,
      function(info) {
        $scope.serverInfo = info;
        $scope.connected = true;
      });

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
