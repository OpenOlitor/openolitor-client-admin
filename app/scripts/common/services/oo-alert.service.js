  'use strict';

  angular.module('openolitor').factory('alertService', ['$injector', function($injector) {

    var $rootScope = $injector.get('$rootScope');
    var $timeout = $injector.get('$timeout');

    function checkAlerts(targetScope) {
      if (!targetScope.alerts) {
        targetScope.alerts = [];
      }
    }

    return {
      /**
       * Add an alert to the global scope using type (error, info, warning)
       */
      addAlert: function(type, msg) {
        var message = {
          'type': type,
          'msg': msg
        };

        checkAlerts($rootScope);

        $rootScope.alerts.push(message);

        // If it's an info message, automatically remove the element after 1 second.
        if (type === 'info') {
          $timeout(function() {
            var index = $rootScope.alerts.indexOf(message);

            if (index > -1) {
              $rootScope.alerts.splice(index, 1);
            }
          }, 1000, true);
        }
      },

      removeAlert: function() {
        return function(index) {
          checkAlerts($rootScope);
          $rootScope.alerts.splice(index, 1);
        };
      }
    };
  }]);
