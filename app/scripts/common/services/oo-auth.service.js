  'use strict';

  /**
   * If the current route does not resolve, go back to the start page.
   */
  var checkAuth = function($q, ooAuthService, $rootScope, $location, $log) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
      return ooAuthService.authorize(next.access).then(function(
        authorized) {
        $log.debug('check authorization:' + next.access + ' -> ' +
          authorized);
        if (!authorized) {
          ooAuthService.isLoggedIn().then(function(loggedIn) {
            if (loggedIn) {
              $location.path('/forbidden');
            } else {
              $location.path('/login');
            }
          });
        }
      });
    });
  };
  checkAuth.$inject = ['$q', 'ooAuthService', '$rootScope', '$location', '$log'];

  angular.module('openolitor').factory('ooAuthService', ['$http', '$location',
      '$q', '$cookies', '$log', 'API_URL',
      function($http, $location, $q, $cookies, $log, API_URL) {
        var user, token = $cookies.get('XSRF-TOKEN');

        var currentUser = function() {
          return $http.get(API_URL + 'auth/user').then(function(response) {
            user = response.data;
            $log.debug('Login succeeded:' + user);
            return user;
          });
        };

        var resolveUser = function() {
          /* If the token is assigned, check that the token is still valid on the server */
          var deferred = $q.defer();
          if (user) {
            deferred.resolve(user);
          } else if (token) {
            $log.debug('Restoring user from cookie...');
            currentUser()
              .then(function(u) {
                user = u;
                deferred.resolve(u);
              }, function() {
                $log.debug('Token no longer valid, please log in.');
                token = undefined;
                $cookies.remove('XSRF-TOKEN');
                deferred.reject('Token invalid');
              });
          } else {
            user = {
              id: '',
              rolle: 'Guest'
            };
            deferred.resolve(user);
          }

          return deferred.promise;
        };



        return {
          loggedIn: function(tkn) {
            $cookies.put('XSRF-TOKEN', tkn);
            $log.debug('logged in', tkn);
            return currentUser().then(function(usr) {
              $log.debug('resolved user after login', usr);
              user = usr;
              token = tkn;
              return usr;
            });
          },
          loggedOut: function() {
            // Logout on server in a real app
            $cookies.remove('XSRF-TOKEN');
            token = undefined;
            user = undefined;
            $location.$$search = {}; // clear token & token signature
            $log.debug('Good bye');
          },
          resolveUser: resolveUser,
          getUser: function() {
            return user;
          },
          getToken: function() {
            return token;
          },
          authorize: function(accessLevel) {
            return resolveUser().then(function(user) {
              $log.debug('authorize:', accessLevel + ' => ' + user.rolle);
              return accessLevel === undefined || accessLevel ===
                userRoles.Guest || accessLevel === user.rolle;
            });
          },
          isLoggedIn: function() {
            return resolveUser().then(function(user) {
              return user.rolle !== userRoles.Guest;
            });
          },
          isUserLoggedIn: function(user) {
            if (user === undefined) {
              return false;
            }
            return user.rolle !== userRoles.Guest;
          }
        };
      }
    ])
    .factory('requestSecurityInjector', ['$cookies', 'moment', '$log', function(
      $cookies, moment, $log) {
      return {
        request: function(config) {
          var token = $cookies.get('XSRF-TOKEN');

          if (token) {
            //add enhanced token to request header
            var enhancedToken = token + '::' + moment().toISOString();
            config.headers['XSRF-TOKEN'] = enhancedToken;
          }

          return config;
        }
      };
    }])
    .config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('requestSecurityInjector');
      // enable send cookies with requests
      $httpProvider.defaults.withCredentials = true;
    }])
    .run(checkAuth);
