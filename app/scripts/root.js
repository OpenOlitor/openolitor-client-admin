'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope',
    'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment',
    '$location', 'msgBus', 'checkSize', '$window', '$timeout', 'BUILD_NR',
    'ENV', 'VERSION', 'cssInjector', 'API_URL',
    'ooAuthService', '$cookies',
    function($scope, $rootScope, ServerService, ProjektService,
      gettextCatalog, amMoment, $location, msgBus, checkSize, $window,
      $timeout, BUILD_NR, ENV, VERSION, cssInjector, API_URL,
      ooAuthService, $cookies) {
      angular.element($window).bind('resize', function() {
        checkSize();
      });

      $scope.currentPathContains = function(pathJunk) {
        return $location.url().indexOf(pathJunk) !== -1;
      };

      //initial launch
      checkSize();

      $scope.connected = false;

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);
        $scope.user = user;

        if($scope.loggedIn) {
          ProjektService.resolveProjekt().then(function(projekt) {
            $scope.projekt = projekt;
            $rootScope.projekt = projekt;
          });
        }
      });

      $timeout(function() {
        $scope.menushow[angular.element('.sidebar-nav .active').parent()
          .attr(
            'activate-id')] = true;
      }, 0);

      var unwatchStaticServerInfo = $scope.$watch(ServerService.getStaticServerInfo,
        function(info) {
          if (!angular.isUndefined(info)) {
            $scope.serverInfo = info;
            $scope.connected = true;
          }
        });

      $scope.buildNr = BUILD_NR;
      $scope.env = ENV;
      $scope.version = VERSION;

      msgBus.onMsg('WebSocketClosed', $rootScope, function(event, msg) {
        $scope.connected = false;
        $scope.messagingSocketClosedReason = msg.reason;
        $timeout(function() {
          $scope.showConnectionErrorMessage = true;
        }, 30000);
        $scope.$apply();
      });

      msgBus.onMsg('WebSocketOpen', $rootScope, function() {
        $scope.connected = true;
        $scope.showConnectionErrorMessage = false;
        $scope.messagingSocketClosedReason = '';
        $scope.$apply();
      });

      $scope.changeLang = function(lang) {
        if (!angular.isUndefined(lang)) {
          gettextCatalog.setCurrentLanguage(lang);
          amMoment.changeLocale(lang);
          $scope.storeActiveLang(lang);
          $scope.$emit('languageChanged');
        }
      };

      $scope.activeLang = function() {
        return gettextCatalog.getCurrentLanguage();
      };

      $scope.storedActiveLang = function() {
        return $cookies.get('activeLang');
      };

      $scope.storeActiveLang = function(lang) {
        $cookies.put('activeLang', lang);
      };

      if (angular.isUndefined($scope.storedActiveLang())) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        if(lang.indexOf('de-') > 0) {
          $scope.changeLang('de');
        } else if(lang.indexOf('fr-') > 0) {
          $scope.changeLang('fr');
        } else if(lang.indexOf('en-') > 0) {
          $scope.changeLang('en');
        } else {
          $scope.changeLang('de');
        }
      } else {
        $scope.changeLang($scope.storedActiveLang());
      }

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
        unwatchStaticServerInfo();
      });

      cssInjector.add(API_URL + 'ressource/style/admin');
    }
  ]);
