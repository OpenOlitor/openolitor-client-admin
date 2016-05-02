'use strict';

/**
 */
angular.module('openolitor')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope', 'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment', '$location', 'msgBus', 'checkSize', '$window', '$timeout', 'BUILD_NR',
  function($scope, $rootScope, ServerService, ProjektService, gettextCatalog, amMoment, $location, msgBus, checkSize, $window, $timeout, BUILD_NR) {
    angular.element($window).bind('resize', function() {
      checkSize();
    });

    $scope.currentPathContains = function(pathJunk) {
      return $location.url().indexOf(pathJunk) !== -1;
    };

    //initial launch
    checkSize();

    $scope.connected = false;

    $scope.$watch(ProjektService.getProjekt,
      function(projekt) {
        $scope.projekt = projekt;
        $rootScope.projekt = projekt;
      });

    $scope.$watch(ServerService.getStaticServerInfo,
      function(info) {
        if(!angular.isUndefined(info)) {
          $scope.serverInfo = info;
          $scope.connected = true;
        }
      });

    $scope.buildNr = BUILD_NR;

    msgBus.onMsg('WebSocketClosed', $rootScope, function(event, msg) {
      $scope.connected = false;
      $scope.messagingSocketClosedReason = msg.reason;
      $scope.$apply();
    });

    msgBus.onMsg('WebSocketOpen', $rootScope, function() {
      $scope.connected = true;
      $scope.messagingSocketClosedReason = '';
      $scope.$apply();
    });



    $timeout(function() {
      $scope.menushow[angular.element( '.sidebar-nav .active' ).parent().attr('activate-id')] = true;
    }, 0);

    $scope.changeLang = function(lang) {
      if (!angular.isUndefined(lang)) {
        gettextCatalog.setCurrentLanguage(lang);
        amMoment.changeLocale(lang);
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
