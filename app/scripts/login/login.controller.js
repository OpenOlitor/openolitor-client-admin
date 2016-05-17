'use strict';

/**
 */
angular.module('openolitor')
  .controller('LoginController', ['$scope', '$http', 'API_URL', 'gettext',
    'alertService', '$timeout', '$location', '$route', 'ooAuthService',
    function($scope, $http, API_URL, gettext, alertService, $timeout,
      $location, $route, ooAuthService) {
      $scope.loginData = {};
      $scope.secondFactorData = {};
      $scope.status = 'login';

      var showWelcomeMessage = function(token, person) {
        //show welcome message
        alertService.addAlert('info', gettext('Willkommen') + ' ' +
          person.vorname + ' ' +
          person.name);
        $timeout(function() {
          $location.path('/');
          $scope.status = 'login';
        }, 1000);

        ooAuthService.loggedIn(token);
      };

      var showGoodbyeMessage = function() {
        //show welcome message
        var usr = ooAuthService.getUser();
        alertService.addAlert('info', gettext('Aufwiedersehen') + ' ' +
          usr.vorname + ' ' +
          usr.name);
        $timeout(function() {
          $scope.status = 'login';
          $location.path('/login');
        }, 1000);

        ooAuthService.loggedOut();
      };

      var logout = $route.current.$$route.logout;
      if (logout) {
        $http.post(API_URL + 'auth/logout').then(function() {
          $scope.loginData.message = undefined;

          showGoodbyeMessage();
        });
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
              $scope.secondFactorForm.message = undefined;
              showWelcomeMessage(result.data.token, result.data.person);
            }, function(error) {
              $scope.secondFactorData.message = gettext(error.data);
            });
        }
      };
    }
  ]);
