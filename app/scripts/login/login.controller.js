'use strict';

/**
 */
angular.module('openolitor')
  .controller('LoginController', ['$scope', '$rootScope', '$http',
    'API_URL', 'ENV', 'gettext',
    'alertService', '$timeout', '$location', '$route', '$routeParams', 'ooAuthService',
    function($scope, $rootScope, $http, API_URL, ENV, gettext, alertService, $timeout,
      $location, $route, $routeParams, ooAuthService) {
      $scope.loginData = {};
      $scope.secondFactorData = {};
      $scope.changePwd = {
        neu: undefined,
        alt: undefined,
        neuConfirmed: undefined
      };
      $scope.status = 'login';
      $scope.env = ENV;

      $scope.originalTgState = $rootScope.tgState;
      $rootScope.tgState = false;

      var showWelcomeMessage = function(token, person) {
        //show welcome message
        alertService.addAlert('info', gettext('Willkommen') + ' ' +
          person.vorname + ' ' +
          person.name);
        $timeout(function() {
          $location.path('/');
          $scope.status = 'login';
          $rootScope.tgState = $scope.originalTgState;
        }, 1000);

        ooAuthService.loggedIn(token);
      };

      var showGoodbyeMessage = function(usr) {
        alertService.addAlert('info', gettext('Aufwiedersehen') + ' ' +
          usr.vorname + ' ' +
          usr.name);
      };

      var doLogout = function(showMessage, msg) {
        var usr = ooAuthService.getUser();
        $http.post(API_URL + 'auth/logout').then(function() {
          $scope.loginData.message = undefined;

          ooAuthService.loggedOut();
          if (showMessage) {
            showGoodbyeMessage(usr);
          }

          $timeout(function() {
            $scope.status = 'login';
            if (msg && msg !== '') {
              $location.path('/login').search('msg', msg);
            }
            else {
              $location.path('/login');
            }
          }, 1000);
        });
      };

      var showPasswordChangedMessage = function() {
        //show welcome message
        alertService.addAlert('info', gettext(
          'Passwort wurde erfolgreich geändert, Sie werden automatisch ausgelogged.'
        ));

        doLogout(false, gettext(
          'Passwort wurde erfolgreich geändert, Sie wurden automatisch ausgelogged. Bitte loggen Sie sich mit dem neuen Passwort erneut an.'
        ));
      };

      var logout = $route.current.$$route.logout;
      if (logout) {
        doLogout(true);
      }
      var msg = $routeParams.msg;
      if (msg && msg !== '') {
        $scope.loginData.message = msg;
      }

      $scope.login = function() {
        if ($scope.loginForm.$valid) {
          $http.post(API_URL + 'auth/login', $scope.loginData).then(
            function(
              result) {
              $scope.loginData.message = undefined;

              //check result
              if (result.data.status === 'LoginSecondFactorRequired') {
                //redirect to second factor authentication
                $scope.status = 'twoFactor';
                $scope.person = result.data.person;
                $scope.secondFactorData.token = result.data.token;
              } else {
                showWelcomeMessage(result.data.token, result.data.person);
              }
            },
            function(error) {
              $scope.loginData.message = gettext(error.data);
            });
        }
      };

      $scope.secondFactorLogin = function() {
        if ($scope.secondFactorForm.$valid) {
          $http.post(API_URL + 'auth/secondFactor', $scope.secondFactorData)
            .then(function(
              result) {
              $scope.secondFactorData.message = undefined;
              showWelcomeMessage(result.data.token, result.data.person);
            }, function(error) {
              $scope.secondFactorData.message = gettext(error.data);
            });
        }
      };

      $scope.changePassword = function() {
        if ($scope.changePwdForm.$valid) {
          $http.post(API_URL + 'auth/passwd', $scope.changePwd)
            .then(function() {
              $scope.changePwd.message = undefined;
              showPasswordChangedMessage();
            }, function(error) {
              $scope.changePwd.message = gettext(error.data);
            });
        }
      };
    }
  ]);
