'use strict';

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
    JAHR: 'Jahr',
    QUARTAL: 'Quartal',
    MONAT: 'Monat',
    LIEFERUNG: 'Lieferung',
    ABO: 'Aboende'
  })
  .constant('VERTRIEBSARTEN', {
    DEPOTLIEFERUNG: 'Depotlieferung',
    HEIMLIEFERUNG: 'Heimlieferung',
    POSTLIEFERUNG: 'Postlieferung'
  })
  .constant('LAUFZEITEINHEITEN', {
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
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$injector', function(
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
    }]);
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
