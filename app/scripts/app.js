'use strict';

var regexIso8601 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?$/;
// Matches YYYY-MM-ddThh:mm:ss.sssZ where .sss is optional
//var regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

function convertDateStringsToDates(input) {
  // Ignore things that aren't objects.
  if (typeof input !== "object") return input;

  for (var key in input) {
    if (!input.hasOwnProperty(key)) continue;

    var value = input[key];
    var match;
    // Check for string properties which look like dates.
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
      var milliseconds = Date.parse(match[0])
      if (!isNaN(milliseconds)) {
        input[key] = new Date(milliseconds);
      }
    } else if (typeof value === "object") {
      // Recurse into object
      input[key] = convertDateStringsToDates(value);
    }
  }
  return input;
}

function convertDateToDateStrings(input) {
  // Ignore things that aren't objects.
  if (typeof input !== "object") return input;

  for (var key in input) {
    if (!input.hasOwnProperty(key)) continue;

    var value = input[key];
    var match;
    // Check for string properties which look like dates.
    if (value instanceof Date) {
      var text = value.toISOString();
      if (text) {
        input[key] = text;
      }
    } else if (typeof value === "object") {
      // Recurse into object
      input[key] = convertDateToDateStrings(value);
    }
  }
  return input;
}

/**
 */
angular
  .module('openolitor', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTable',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'color.picker',
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('LIEFERRHYTHMEN', {
    WOECHENTLICH: 'Woechentlich',
    ZWEIWOECHENTLICH: 'Zweiwoechentlich',
    MONATLICH: 'Monatlich',
  })
  .constant('PREISEINHEITEN', {
    //JAHR: 'Jahr',
    //QUARTAL: 'Quartal',
    //MONAT: 'Monat',
    LIEFERUNG: 'Lieferung'
      //ABO: 'Aboende'
  })
  .constant('VERTRIEBSARTEN', {
    DEPOTLIEFERUNG: 'Depotlieferung',
    HEIMLIEFERUNG: 'Heimlieferung',
    POSTLIEFERUNG: 'Postlieferung'
  })
  .constant('LAUFZEITEINHEITEN', {
    UNBESCHRAENKT: 'Unbeschraenkt',
    LIEFERUNGEN: 'Lieferungen',
    MONATE: 'Monate'
  })
  .constant('ABOTYPEN', {
    DEPOTLIEFERUNGABO: 'DepotlieferungAbo',
    HEIMLIEFERUNGABO: 'HeimlieferungAbo',
    POSTLIEFERUNGABO: 'PostlieferungAbo'
  })
  .constant('ABOTYPEN_ARRAY', ['DepotlieferungAbo', 'HeimlieferungAbo',
    'PostlieferungAbo'
  ])
  .constant('LIEFERZEITPUNKTE', {
    MONTAG: {
      id: 'Montag',
      label: {
        long: 'Montag',
        short: 'MO'
      }
    },
    DIENSTAG: {
      id: 'Dienstag',
      label: {
        long: 'Dienstag',
        short: 'DI'
      }
    },
    MITTWOCH: {
      id: 'Mittwoch',
      label: {
        long: 'Mittwoch',
        short: 'MI'
      }
    },
    DONNERSTAG: {
      id: 'Donnerstag',
      label: {
        long: 'Donnerstag',
        short: 'DO'
      }
    },
    FREITAG: {
      id: 'Freitag',
      label: {
        long: 'Freitag',
        short: 'FR'
      }
    },
    SAMSTAG: {
      id: 'Samstag',
      label: {
        long: 'Samstag',
        short: 'SA'
      }
    },
    SONNTAG: {
      id: 'Sonntag',
      label: {
        long: 'Sonntag',
        short: 'SO'
      }
    }
  })
  .run(function($rootScope, $location) {
    $rootScope.location = $location;
  })
  .factory('msgBus', ['$rootScope', function($rootScope) {
    var msgBus = {};
    msgBus.emitMsg = function(msg) {
      $rootScope.$emit(msg.type, msg);
    };
    msgBus.onMsg = function(msg, scope, func) {
      var unbind = $rootScope.$on(msg, func);
      scope.$on('$destroy', unbind);
    };
    return msgBus;
  }])
  .run(['ooClientMessageService', function(clientMessageService) {
    console.log('Start clientMessageService');
    clientMessageService.start();
  }])
  .config(["$httpProvider", function($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData) {
      return convertDateStringsToDates(responseData);
    });
    d
  }])
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$injector',
      function(
        $log, $injector) {
        return function(exception) {
          // using the injector to retrieve scope and timeout, otherwise circular dependency
          var $rootScope = $injector.get('$rootScope');
          var alertService = $injector.get('alertService');

          $rootScope.$removeAlert = alertService.removeAlert();
          alertService.addAlert('error', exception.message);

          // log error default style
          $log.error.apply($log, arguments);
        };
      }
    ]);
  }])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/abotypen'
      })
      .when('/abotypen', {
        templateUrl: 'scripts/abotypen/overview/abotypenoverview.html',
        controller: 'AbotypenOverviewController',
        name: 'AbotypenOverview'
      })
      .when('/abotypen/new', {
        templateUrl: 'scripts/abotypen/detail/abotypendetail.html',
        controller: 'AbotypenDetailController',
        name: 'AbotypenDetail'
      })
      .when('/abotypen/:id', {
        templateUrl: 'scripts/abotypen/detail/abotypendetail.html',
        controller: 'AbotypenDetailController',
        name: 'AbotypenDetail'
      })
      .when('/kunden', {
        templateUrl: 'scripts/kunden/overview/kundenoverview.html',
        controller: 'KundenOverviewController',
        name: 'KundenOverview'
      })
      .when('/kunden/new', {
        templateUrl: 'scripts/kunden/detail/kundendetail.html',
        controller: 'KundenDetailController',
        name: 'KundeDetail'
      })
      .when('/kunden/:id', {
        templateUrl: 'scripts/kunden/detail/kundendetail.html',
        controller: 'KundenDetailController',
        name: 'KundeDetail'
      })
      .when('/kunden/:kundeId/abos/new', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .when('/kunden/:kundeId/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .when('/depots', {
        templateUrl: 'scripts/depots/overview/depotsoverview.html',
        controller: 'DepotsOverviewController',
        name: 'DepotsOverview'
      })
      .when('/depots/:id', {
        templateUrl: 'scripts/depots/detail/depotsdetail.html',
        controller: 'DepotsDetailController',
        name: 'DepotsDetail'
      })
      .when('/abos', {
        templateUrl: 'scripts/abos/overview/abosoverview.html',
        controller: 'AbosOverviewController',
        name: 'AbosOverview'
      })
      .when('/settings', {
        templateUrl: 'scripts/projekt/settings/projektsettings.html',
        controller: 'ProjektSettingsController',
        name: 'ProjektSettings'
      })
      .otherwise({
        templateUrl: 'scripts/not-found.html'
      });
  });
