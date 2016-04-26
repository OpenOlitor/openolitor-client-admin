'use strict';

var regexIso8601 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?$/;
// Matches YYYY-MM-ddThh:mm:ss.sssZ where .sss is optional
//var regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

function convertDateStringsToDates(input) {
  // Ignore things that aren't objects.
  if (typeof input !== 'object') {
    return input;
  }

  for (var key in input) {
    if (!input.hasOwnProperty(key)) {
      continue;
    }

    var value = input[key];
    var match;
    // Check for string properties which look like dates.
    if (typeof value === 'string' && (match = value.match(regexIso8601))) {
      var milliseconds = Date.parse(match[0]);
      if (!isNaN(milliseconds)) {
        input[key] = new Date(milliseconds);
      }
    } else if (typeof value === 'object') {
      // Recurse into object
      input[key] = convertDateStringsToDates(value);
    }
  }
  return input;
}

/* This is a pseudo-function in order to enable gettext-extractor to find the translations that need to be done in the constants.
   As described in https://github.com/rubenv/angular-gettext/issues/67
*/
function gettext(string) {
  return string;
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
    'ngFileSaver',
    'angular.filter',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'color.picker',
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext',
    'ngHamburger',
    'angularMoment',
    'ngFileUpload'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('LIEFERRHYTHMEN', {
    WOECHENTLICH: 'Woechentlich',
    ZWEIWOECHENTLICH: 'Zweiwoechentlich',
    MONATLICH: 'Monatlich',
    UNREGELMAESSIG: 'Unregelmaessig'
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
  .constant('ANREDE', {
    HERR: 'Herr',
    FRAU: 'Frau'
  })
  .constant('ABOTYPEN', {
    DEPOTLIEFERUNGABO: 'DepotlieferungAbo',
    HEIMLIEFERUNGABO: 'HeimlieferungAbo',
    POSTLIEFERUNGABO: 'PostlieferungAbo'
  })
  .constant('LIEFERSTATUS', {
    OFFEN: 'Offen',
    INBEARBEITUNG: 'InBearbeitung',
    BEARBEITET: 'Bearbeitet'
  })
  .constant('LIEFEREINHEIT', {
    STUECK: {
      id: 'STUECK',
      label: {
        long: gettext('Stück'),
        short: gettext('St.')
      }
    },
    BUND: {
      id: 'BUND',
      label: {
        long: gettext('Bund'),
        short: gettext('Bu.')
      }
    },
    GRAMM: {
      id: 'GRAMM',
      label: {
        long: gettext('Gramm'),
        short: gettext('gr')
      }
    },
    KILOGRAMM: {
      id: 'KILOGRAMM',
      label: {
        long: gettext('Kilogramm'),
        short: gettext('kg')
      }
    }
  })
  .constant('ABOTYPEN_ARRAY', ['DepotlieferungAbo', 'HeimlieferungAbo',
    'PostlieferungAbo'
  ])
  .constant('WAEHRUNG', {
    CHF: {
      id: 'CHF',
      label: {
        long: gettext('Schweizer Franken'),
        short: gettext('CHF')
      }
    },
    EUR: {
      id: 'EUR',
      label: {
        long: gettext('Euro'),
        short: gettext('€')
      }
    },
    USD: {
      id: 'USD',
      label: {
        long: gettext('US Dollar'),
        short: gettext('$')
      }
    },
    GBP: {
      id: 'GBP',
      label: {
        long: gettext('Britisches Pfund'),
        short: gettext('£')
      }
    },
    CAD: {
      id: 'CAD',
      label: {
        long: gettext('Kanadischer Dollar'),
        short: gettext('CAD')
      }
    },
  })
  .constant('LIEFERZEITPUNKTE', {
    MONTAG: {
      id: 'Montag',
      label: {
        long: gettext('Montag'),
        short: gettext('MO')
      },
      value: 1
    },
    DIENSTAG: {
      id: 'Dienstag',
      label: {
        long: gettext('Dienstag'),
        short: gettext('DI')
      },
      value: 2
    },
    MITTWOCH: {
      id: 'Mittwoch',
      label: {
        long: gettext('Mittwoch'),
        short: gettext('MI')
      },
      value: 3
    },
    DONNERSTAG: {
      id: 'Donnerstag',
      label: {
        long: gettext('Donnerstag'),
        short: gettext('DO')
      },
      value: 4
    },
    FREITAG: {
      id: 'Freitag',
      label: {
        long: gettext('Freitag'),
        short: gettext('FR')
      },
      value: 5
    },
    SAMSTAG: {
      id: 'Samstag',
      label: {
        long: gettext('Samstag'),
        short: gettext('SA')
      },
      value: 6
    },
    SONNTAG: {
      id: 'Sonntag',
      label: {
        long: gettext('Sonntag'),
        short: gettext('SO')
      },
      value: 7
    }
  })
  .constant('MONATE', {
    JANUAR: {
      id: 'Januar',
      label: {
        long: gettext('Januar'),
        short: gettext('Jan')
      },
      value: 1
    },
    FEBRUAR: {
      id: 'Februar',
      label: {
        long: gettext('Februar'),
        short: gettext('Feb')
      },
      value: 2
    },
    MAERZ: {
      id: 'Maerz',
      label: {
        long: gettext('März'),
        short: gettext('Mar')
      },
      value: 3
    },
    APRIL: {
      id: 'April',
      label: {
        long: gettext('April'),
        short: gettext('Apr')
      },
      value: 4
    },
    MAI: {
      id: 'Mai',
      label: {
        long: gettext('Mai'),
        short: gettext('Mai')
      },
      value: 5
    },
    JUNI: {
      id: 'Juni',
      label: {
        long: gettext('Juni'),
        short: gettext('Jun')
      },
      value: 6
    },
    JULI: {
      id: 'Juli',
      label: {
        long: gettext('Juli'),
        short: gettext('Jul')
      },
      value: 7
    },
    AUGUST: {
      id: 'August',
      label: {
        long: gettext('August'),
        short: gettext('Aug')
      },
      value: 8
    },
    SEPTEMBER: {
      id: 'September',
      label: {
        long: gettext('September'),
        short: gettext('Sep')
      },
      value: 9
    },
    OKTOBER: {
      id: 'Oktober',
      label: {
        long: gettext('Oktober'),
        short: gettext('Okt')
      },
      value: 10
    },
    NOVEMBER: {
      id: 'November',
      label: {
        long: gettext('November'),
        short: gettext('Nov')
      },
      value: 11
    },
    DEZEMBER: {
      id: 'Dezember',
      label: {
        long: gettext('Dezember'),
        short: gettext('Dez')
      },
      value: 12
    }
  })
  .constant('PENDENZSTATUS', {
    AUSSTEHEND: 'Ausstehend',
    ERLEDIGT: 'Erledigt',
    NICHTERLEDIGT: 'NichtErledigt'
  })
  .run(function($rootScope, $location) {
    $rootScope.location = $location;
  })
  .factory('checkSize', ['$rootScope', '$window', function($rootScope, $window) {
    return function() {
      if ($window.innerWidth >= 1200) {
        $rootScope.tgState = true;
      }
    };
  }])
  .factory('exportTable', ['FileSaver', function(FileSaver) {
    return function(elementId, fileName) {
      var blob = new Blob([angular.element(elementId).html()], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      FileSaver.saveAs(blob, fileName);
    };
  }])
  .factory('cloneObj', function() {
    var cloneObjFun = function(obj) {
      if (null === obj || 'object' !== typeof obj) {
        return obj;
      }
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          copy[attr] = cloneObjFun(obj[attr]);
        }
      }
      return copy;
    };
    return cloneObjFun;
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
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData) {
      return convertDateStringsToDates(responseData);
    });
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
  .filter('fromNow', function() {
    return function(input) {
      //TODO: replace with current locale
      moment.locale('de');
      return moment(input).fromNow();
    };
  })
  .filter('lastElement', function() {
    return function(input) {
      if (angular.isArray(input)) {
        return input[input.length - 1];
      }
      return input;
    };
  })
  .filter('firstElement', function() {
    return function(input) {
      if (angular.isArray(input)) {
        return input[0];
      }
      return input;
    };
  })
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/abos'
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
      .when('/kunden/:kundeId/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .when('/produzenten', {
        templateUrl: 'scripts/produzenten/overview/produzentenoverview.html',
        controller: 'ProduzentenOverviewController',
        name: 'ProduzentenOverview'
      })
      .when('/produzenten/new', {
        templateUrl: 'scripts/produzenten/detail/produzentendetail.html',
        controller: 'ProduzentenDetailController',
        name: 'ProduzentenDetail'
      })
      .when('/produzenten/:id', {
        templateUrl: 'scripts/produzenten/detail/produzentendetail.html',
        controller: 'ProduzentenDetailController',
        name: 'ProduzentenDetail'
      })
      .when('/produzenten/:produzentId/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .when('/produkte', {
        templateUrl: 'scripts/produkte/overview/produkteoverview.html',
        controller: 'ProdukteOverviewController',
        name: 'ProdukteOverview'
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
      .when('/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail',
        resolve: {
          createKundeId: function() {
            return undefined;
          }
        }
      })
      .when('/touren', {
        templateUrl: 'scripts/touren/overview/tourenoverview.html',
        controller: 'TourenOverviewController',
        name: 'TourenOverview'
      })
      .when('/pendenzen', {
        templateUrl: 'scripts/pendenzen/overview/pendenzenoverview.html',
        controller: 'PendenzenOverviewController',
        name: 'PendenzenOverview'
      })
      .when('/lieferplanung', {
        templateUrl: 'scripts/lieferplanungen/overview/lieferplanungoverview.html',
        controller: 'LieferplanungOverviewController',
        name: 'LieferplanungOverview'
      })
      .when('/lieferplanung/:id', {
        templateUrl: 'scripts/lieferplanungen/detail/lieferplanungdetail.html',
        controller: 'LieferplanungDetailController',
        name: 'LieferplanungDetail'
      })
      .when('/rechnungen', {
        templateUrl: 'scripts/rechnungen/overview/rechnungenoverview.html',
        controller: 'RechnungenOverviewController',
        name: 'RechnungenOverview'
      })
      .when('/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail'
      })
      .when('/rechnungen/:id', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail'
      })
      .when('/kunden/:kundeId/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail'
      })
      .when('/kunden/:kundeId/abos/:aboId/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail'
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
