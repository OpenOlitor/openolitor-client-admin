'use strict';

var regexIso8601 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?$/;
// Matches YYYY-MM-ddThh:mm:ss.sssZ where .sss is optional
//var regexIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/

var userRoles = {
  Guest: 'Guest',
  Administrator: 'Administrator'
};

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

function addExtendedEnumValue(id, labelLong, labelShort, value) {
  return {
    id: id,
    label: {
      long: labelLong,
      short: labelShort
    },
    value: value
  };
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
  .module('openolitor-admin', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTable',
    'ngFileSaver',
    'ngCookies',
    'ngPasswordStrength',
    'ngMessages',
    'angular.filter',
    'angular-toArrayFilter',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'color.picker',
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext',
    'ngHamburger',
    'angularMoment',
    'ngFileUpload',
    'ngLodash',
    'angular-sortable-view',
    'angular.css.injector',
    'openolitor-core'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('ENV', '@@ENV')
  .constant('VERSION', '@@VERSION')
  .constant('AIRBREAK_API_KEY', '@@AIRBREAK_API_KEY')
  .constant('AIRBREAK_URL', '@@AIRBREAK_URL')
  .constant('EMAIL_TO_ADDRESS', '@@EMAIL_TO_ADDRESS')
  .constant('LIEFERRHYTHMEN', {
    WOECHENTLICH: gettext('Woechentlich'),
    ZWEIWOECHENTLICH: gettext('Zweiwoechentlich'),
    MONATLICH: gettext('Monatlich'),
    UNREGELMAESSIG: gettext('Unregelmaessig')
  })
  .constant('PREISEINHEITEN', {
    //JAHR: 'Jahr',
    //QUARTAL: 'Quartal',
    //MONAT: 'Monat',
    LIEFERUNG: gettext('Lieferung')
      //ABO: 'Aboende'
  })
  .constant('VERTRIEBSARTEN', {
    DEPOTLIEFERUNG: gettext('Depotlieferung'),
    HEIMLIEFERUNG: gettext('Heimlieferung'),
    POSTLIEFERUNG: gettext('Postlieferung')
  })
  .constant('LAUFZEITEINHEITEN', {
    UNBESCHRAENKT: gettext('Unbeschraenkt'),
    LIEFERUNGEN: gettext('Lieferungen'),
    MONATE: gettext('Monate')
  })
  .constant('FRISTEINHEITEN', {
    MONATE: 'Monate',
    WOCHEN: 'Wochen'
  })
  .constant('ANREDE', {
    KEINE: addExtendedEnumValue(undefined, gettext('Keine'), gettext('-')),
    HERR: addExtendedEnumValue('Herr', gettext('Herr'), gettext('Hr.')),
    FRAU: addExtendedEnumValue('Frau', gettext('Frau'), gettext('Fr.'))
  })
  .constant('ABOTYPEN', {
    DEPOTLIEFERUNGABO: gettext('DepotlieferungAbo'),
    HEIMLIEFERUNGABO: gettext('HeimlieferungAbo'),
    POSTLIEFERUNGABO: gettext('PostlieferungAbo')
  })
  .constant('LIEFERSTATUS', {
    UNGEPLANT: gettext('Ungeplant'),
    OFFEN: gettext('Offen'),
    ABGESCHLOSSEN: gettext('Abgeschlossen'),
    VERRECHNET: gettext('Verrechnet')
  })
  .constant('BESTELLSTATUS', {
    ABGESCHLOSSEN: gettext('Abgeschlossen'),
    VERRECHNET: gettext('Verrechnet')
  })
  .constant('RECHNUNGSTATUS', {
    ERSTELLT: gettext('Erstellt'),
    VERSCHICKT: gettext('Verschickt'),
    BEZAHLT: gettext('Bezahlt'),
    MAHNUNG_VERSCHICKT: gettext('MahnungVerschickt'),
    STORNIERT: gettext('Storniert')
  })
  .constant('KORBSTATUS', {
    WIRDGELIEFERT: gettext('WirdGeliefert'),
    GELIEFERT: gettext('Geliefert'),
    FAELLTAUSABWESEND: gettext('FaelltAusAbwesend'),
    FAELLTAUSSALDOZUTIEF: gettext('FaelltAusSaldoZuTief'),
    FAELLTAUSGEKUENDIGT: gettext('FaelltAusGekuendigt')
  })
  .constant('LIEFEREINHEIT', {
    STUECK: addExtendedEnumValue('Stueck', gettext('Stück'), gettext('St.')),
    BUND: addExtendedEnumValue('Bund', gettext('Bund'), gettext('Bu.')),
    GRAMM: addExtendedEnumValue('Gramm', gettext('Gramm'), gettext('gr')),
    KILOGRAMM: addExtendedEnumValue('Kilogramm', gettext('Kilogramm'),
      gettext('kg')),
    LITER: addExtendedEnumValue('Liter', gettext('Liter'), gettext('l'))
  })
  .constant('ABOTYPEN_ARRAY', ['DepotlieferungAbo', 'HeimlieferungAbo',
    'PostlieferungAbo'
  ])
  .constant('WAEHRUNG', {
    CHF: addExtendedEnumValue('CHF', gettext('Schweizer Franken'), gettext(
      'CHF')),
    EUR: addExtendedEnumValue('EUR', gettext('Euro'), gettext('EUR')),
    USD: addExtendedEnumValue('USD', gettext('US Dollar'), gettext('USD')),
    GBP: addExtendedEnumValue('GBP', gettext('Britisches Pfund'), gettext(
      'GBP')),
    CAD: addExtendedEnumValue('CAD', gettext('Kanadischer Dollar'), gettext(
      'CAD'))
  })
  .constant('LIEFERZEITPUNKTE', {
    MONTAG: addExtendedEnumValue('Montag', gettext('Montag'), gettext('MO'),
      1),
    DIENSTAG: addExtendedEnumValue('Dienstag', gettext('Dienstag'), gettext(
      'DI'), 2),
    MITTWOCH: addExtendedEnumValue('Mittwoch', gettext('Mittwoch'), gettext(
      'MI'), 3),
    DONNERSTAG: addExtendedEnumValue('Donnerstag', gettext('Donnerstag'),
      gettext('DO'), 4),
    FREITAG: addExtendedEnumValue('Freitag', gettext('Freitag'), gettext('FR'),
      5),
    SAMSTAG: addExtendedEnumValue('Samstag', gettext('Samstag'), gettext('SA'),
      6),
    SONNTAG: addExtendedEnumValue('Sonntag', gettext('Sonntag'), gettext('SO'),
      7)
  })
  .constant('MONATE', {
    JANUAR: addExtendedEnumValue('Januar', gettext('Januar'), gettext('Jan'),
      1),
    FEBRUAR: addExtendedEnumValue('Februar', gettext('Februar'), gettext(
      'Feb'), 2),
    MAERZ: addExtendedEnumValue('Maerz', gettext('März'), gettext('Mar'), 3),
    APRIL: addExtendedEnumValue('April', gettext('April'), gettext('Apr'), 4),
    MAI: addExtendedEnumValue('Mai', gettext('Mai'), gettext('Mai'), 5),
    JUNI: addExtendedEnumValue('Juni', gettext('Juni'), gettext('Jun'), 6),
    JULI: addExtendedEnumValue('Juli', gettext('Juli'), gettext('Jul'), 7),
    AUGUST: addExtendedEnumValue('August', gettext('August'), gettext('Aug'),
      8),
    SEPTEMBER: addExtendedEnumValue('September', gettext('September'),
      gettext('Sep'), 9),
    OKTOBER: addExtendedEnumValue('Oktober', gettext('Oktober'), gettext(
      'Okt'), 10),
    NOVEMBER: addExtendedEnumValue('November', gettext('November'), gettext(
      'Nov'), 11),
    DEZEMBER: addExtendedEnumValue('Dezember', gettext('Dezember'), gettext(
      'Dez'), 12)
  })
  .constant('PENDENZSTATUS', {
    AUSSTEHEND: gettext('Ausstehend'),
    ERLEDIGT: gettext('Erledigt'),
    NICHTERLEDIGT: gettext('NichtErledigt')
  })
  .constant('AUSLIEFERUNGSTATUS', {
    ERFASST: gettext('Erfasst'),
    AUSGELIEFERT: gettext('Ausgeliefert'),
  })
  .constant('ROLLE', {
    KUNDE: gettext('Kunde'),
    ADMINISTRATOR: gettext('Administrator'),
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
    return function(tableController, fileName) {
      tableController.exportODS(function(file) {
        FileSaver.saveAs(file.response, fileName);
      });
    };
  }])
  .factory('localeSensitiveComparator', function() {
    var isString = function (value) {
      return (typeof value.value === 'string');
    };

    var isNumber = function (value) {
      return (typeof value.value === 'number');
    };

    var isBoolean = function (value) {
      return (typeof value.value === 'boolean');
    };

    return function(v1, v2) {
      if (isString(v1) && isString(v2)) {
        return v1.value.localeCompare(v2.value);
      }

      if ((isNumber(v1) && isNumber(v2)) || (isBoolean(v1) && isBoolean(v2))) {
        return v1.value - v2.value;
      }

      if(angular.isUndefined(v1.value) && !angular.isUndefined(v2.value)) {
        return -1;
      }

      if(angular.isUndefined(v2.value) && !angular.isUndefined(v1.value)) {
        return 1;
      }

      // If we don't get strings, numbers or booleans, just compare by index
      return (v1.index < v2.index) ? -1 : 1;
    };
  })
  .factory('exportODSModuleFunction', function() {
      return {
          params: {
            exportType: '.ods',
          },
          method: 'GET',
          responseType: 'arraybuffer',
          cache: true,
          transformResponse: function (data) {
              var file;
              if (data) {
                  file = new Blob([data], {
                      type: 'application/vnd.oasis.opendocument.spreadsheet'
                  });
              }
              return {
                  response: file
              };
          }
        };
  })
  .factory('cloneObj', function() {
    return function(obj) {
      return angular.copy(obj);
    };
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
  .run(['alertService', '$rootScope', function(alertService, $rootScope) {
    $rootScope.$removeAlert = alertService.removeAlert();
  }])
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$injector',
      function($log, $injector) {
        return function(exception) {
          // using the injector to retrieve services, otherwise circular dependency
          var alertService = $injector.get('alertService');
          alertService.addAlert('error', exception.message);
          // log error default style
          $log.error.apply($log, arguments);
        };
      }
    ]);
  }])
  .factory('errbitErrorInterceptor', function($q, ENV, VERSION, AIRBREAK_API_KEY, AIRBREAK_URL) {
    return {
      responseError: function (rejection) {
        /*jshint -W117 */
        var airbrake = new airbrakeJs.Client({
          projectId: 1,
          host: AIRBREAK_URL,
          projectKey: AIRBREAK_API_KEY});
        /*jshint +W117 */
        airbrake.addFilter(function (notice) {
          notice.context.environment = ENV;
          notice.context.version = VERSION;
          return notice;
        });
        var message = 'Error: ';
        if(!angular.isUndefined(rejection.config) && !angular.isUndefined(rejection.config.url)) {
          message += rejection.config.url;
        }
        airbrake.notify(message);
        return $q.reject(rejection);
      }
    };
  })
  .factory('loggedOutInterceptor', function($q, alertService) {
    return {
      responseError: function (rejection) {
        var status = rejection.status;
        if (status === 401) {
            alertService.removeAllAlerts();
            window.location = '#/logout';
            return;
        }
        return $q.reject(rejection);
      }
    };
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('loggedOutInterceptor');
    $httpProvider.interceptors.push('errbitErrorInterceptor');
  }])
  .filter('fromNow', function(moment) {
    return function(input) {
      return moment(input).fromNow();
    };
  })
  .filter('dateRange', function(moment) {
    function isMidnight(mom) {
      // The moment at midnight
      var mmtMidnight = mom.clone().startOf('day');

      // Difference in minutes == 0 => midnight
      return mom.diff(mmtMidnight, 'minutes') === 0;
    }

    return function(items, from, to, attribute) {
      if(!angular.isUndefined(items) && items.length > 0) {
        var toPlusOne = to;
        var momTo = moment(to);
        if(isMidnight(momTo)) {
          toPlusOne = momTo.add(1, 'days');
        }
        var result = [];
        for (var i=0; i<items.length; i++){
          var itemDate = items[i][attribute];
          if(!angular.isUndefined(attribute)) {
            itemDate = items[i][attribute];
          }
          if(angular.isUndefined(to) && angular.isUndefined(from)) {
            result.push(items[i]);
          } else if(angular.isUndefined(to) && itemDate >= from) {
            result.push(items[i]);
          } else if(angular.isUndefined(from) && itemDate <= toPlusOne) {
            result.push(items[i]);
          } else if (itemDate >= from && itemDate <= toPlusOne)  {
            result.push(items[i]);
          }
        }
        return result;
      }
    };
  })
  .filter('lastElement', function() {
    return function(input, property) {
      if (!input) {
        return;
      }
      if (angular.isArray(input)) {
        if (!input[input.length - 1]) {
          return;
        } else if (property) {
          return input[input.length - 1][property];
        } else {
          return input[input.length - 1];
        }
      }
      if (input && property) {
        return input[property];
      } else {
        return input;
      }
    };
  })
  .filter('firstElement', function() {
    return function(input, property) {
      if (!input) {
        return;
      }
      if (angular.isArray(input)) {
        if (!input[0]) {
          return;
        } else if (property) {
          return input[0][property];
        } else {
          return input[0];
        }
      }
      if (input && property) {
        return input[property];
      } else {
        return input;
      }
    };
  })
  .filter('notIn', function() {
    return function(items, property, elements) {
      var filtered = [];
      if (!items) {
        return filtered;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var val = item[property];
        if (elements.indexOf(val) < 0) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  })
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/abos'
      })
      .when('/abotypen', {
        templateUrl: 'scripts/abotypen/overview/abotypenoverview.html',
        controller: 'AbotypenOverviewController',
        name: 'AbotypenOverview',
        access: userRoles.Administrator,
        reloadOnSearch: false
      })
      .when('/abotypen/new', {
        templateUrl: 'scripts/abotypen/detail/abotypendetail.html',
        controller: 'AbotypenDetailController',
        name: 'AbotypenDetail',
        access: userRoles.Administrator
      })
      .when('/abotypen/:id', {
        templateUrl: 'scripts/abotypen/detail/abotypendetail.html',
        controller: 'AbotypenDetailController',
        name: 'AbotypenDetail',
        access: userRoles.Administrator
      })
      .when('/kunden', {
        templateUrl: 'scripts/kunden/overview/kundenoverview.html',
        controller: 'KundenOverviewController',
        name: 'KundenOverview',
        access: userRoles.Administrator,
        reloadOnSearch: false
      })
      .when('/kunden/new', {
        templateUrl: 'scripts/kunden/detail/kundendetail.html',
        controller: 'KundenDetailController',
        name: 'KundeDetail',
        access: userRoles.Administrator
      })
      .when('/kunden/:id', {
        templateUrl: 'scripts/kunden/detail/kundendetail.html',
        controller: 'KundenDetailController',
        name: 'KundeDetail',
        access: userRoles.Administrator
      })
      .when('/kunden/:kundeId/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail',
        access: userRoles.Administrator
      })
      .when('/personen', {
        templateUrl: 'scripts/personen/overview/personenoverview.html',
        controller: 'PersonenOverviewController',
        name: 'PersonenOverview',
        access: userRoles.Administrator,
        reloadOnSearch: false
      })
      .when('/produzenten', {
        templateUrl: 'scripts/produzenten/overview/produzentenoverview.html',
        controller: 'ProduzentenOverviewController',
        name: 'ProduzentenOverview',
        access: userRoles.Administrator
      })
      .when('/produzenten/new', {
        templateUrl: 'scripts/produzenten/detail/produzentendetail.html',
        controller: 'ProduzentenDetailController',
        name: 'ProduzentenDetail',
        access: userRoles.Administrator
      })
      .when('/produzenten/:id', {
        templateUrl: 'scripts/produzenten/detail/produzentendetail.html',
        controller: 'ProduzentenDetailController',
        name: 'ProduzentenDetail',
        access: userRoles.Administrator
      })
      .when('/produzenten/:produzentId/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail',
        access: userRoles.Administrator
      })
      .when('/lieferantenabrechnungen', {
        templateUrl: 'scripts/lieferantenabrechnungen/overview/lieferantenabrechnungenoverview.html',
        controller: 'LieferantenAbrechnungenOverviewController',
        name: 'LieferantenAbrechnungenOverview',
        access: userRoles.Administrator
      })
      .when('/produkte', {
        templateUrl: 'scripts/produkte/overview/produkteoverview.html',
        controller: 'ProdukteOverviewController',
        name: 'ProdukteOverview',
        access: userRoles.Administrator
      })
      .when('/depots', {
        templateUrl: 'scripts/depots/overview/depotsoverview.html',
        controller: 'DepotsOverviewController',
        name: 'DepotsOverview',
        access: userRoles.Administrator
      })
      .when('/depots/:id', {
        templateUrl: 'scripts/depots/detail/depotsdetail.html',
        controller: 'DepotsDetailController',
        name: 'DepotsDetail',
        access: userRoles.Administrator
      })
      .when('/abos', {
        templateUrl: 'scripts/abos/overview/abosoverview.html',
        controller: 'AbosOverviewController',
        name: 'AbosOverview',
        access: userRoles.Administrator,
        reloadOnSearch: false
      })
      .when('/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail',
        access: userRoles.Administrator
      })
      .when('/touren', {
        templateUrl: 'scripts/touren/overview/tourenoverview.html',
        controller: 'TourenOverviewController',
        name: 'TourenOverview',
        access: userRoles.Administrator
      })
      .when('/touren/:id', {
        templateUrl: 'scripts/touren/detail/tourendetail.html',
        controller: 'TourenDetailController',
        name: 'TourenDetail',
        access: userRoles.Administrator
      })
      .when('/pendenzen', {
        templateUrl: 'scripts/pendenzen/overview/pendenzenoverview.html',
        controller: 'PendenzenOverviewController',
        name: 'PendenzenOverview',
        access: userRoles.Administrator
      })
      .when('/lieferplanung', {
        templateUrl: 'scripts/lieferplanungen/overview/lieferplanungoverview.html',
        controller: 'LieferplanungOverviewController',
        name: 'LieferplanungOverview',
        access: userRoles.Administrator
      })
      .when('/lieferplanung/:id', {
        templateUrl: 'scripts/lieferplanungen/detail/lieferplanungdetail.html',
        controller: 'LieferplanungDetailController',
        name: 'LieferplanungDetail',
        access: userRoles.Administrator
      })
      .when('/depotauslieferungen', {
        templateUrl: 'scripts/auslieferungen/overview/depotauslieferungenoverview.html',
        controller: 'AuslieferungenOverviewController',
        name: 'DepotAuslieferungenOverview',
        model: 'Depot',
        access: userRoles.Administrator
      })
      .when('/depotauslieferungen/:id', {
        templateUrl: 'scripts/auslieferungen/detail/depotauslieferungdetail.html',
        controller: 'AuslieferungDetailController',
        name: 'DepotAuslieferungDetail',
        model: 'Depot',
        access: userRoles.Administrator
      })
      .when('/tourauslieferungen', {
        templateUrl: 'scripts/auslieferungen/overview/tourauslieferungenoverview.html',
        controller: 'AuslieferungenOverviewController',
        name: 'TourAuslieferungenOverview',
        model: 'Tour',
        access: userRoles.Administrator
      })
      .when('/tourauslieferungen/:id', {
        templateUrl: 'scripts/auslieferungen/detail/tourauslieferungdetail.html',
        controller: 'AuslieferungDetailController',
        name: 'TourAuslieferungDetail',
        model: 'Tour',
        access: userRoles.Administrator
      })
      .when('/postauslieferungen', {
        templateUrl: 'scripts/auslieferungen/overview/postauslieferungenoverview.html',
        controller: 'AuslieferungenOverviewController',
        name: 'PostAuslieferungenOverview',
        model: 'Post',
        access: userRoles.Administrator
      })
      .when('/postauslieferungen/:id', {
        templateUrl: 'scripts/auslieferungen/detail/postauslieferungdetail.html',
        controller: 'AuslieferungDetailController',
        name: 'PostAuslieferungDetail',
        model: 'Post',
        access: userRoles.Administrator
      })
      .when('/rechnungen', {
        templateUrl: 'scripts/rechnungen/overview/rechnungenoverview.html',
        controller: 'RechnungenOverviewController',
        name: 'RechnungenOverview',
        access: userRoles.Administrator,
        reloadOnSearch: false
      })
      .when('/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail',
        access: userRoles.Administrator
      })
      .when('/rechnungen/:id', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail',
        access: userRoles.Administrator
      })
      .when('/kunden/:kundeId/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail',
        access: userRoles.Administrator
      })
      .when('/kunden/:kundeId/abos/:aboId/rechnungen/new', {
        templateUrl: 'scripts/rechnungen/detail/rechnungendetail.html',
        controller: 'RechnungenDetailController',
        name: 'RechnungenDetail',
        access: userRoles.Administrator
      })
      .when('/zahlungsimports', {
        templateUrl: 'scripts/zahlungsimports/overview/zahlungsimportsoverview.html',
        controller: 'ZahlungsImportsOverviewController',
        name: 'ZahlungsImportsOverview',
        access: userRoles.Administrator
      })
      .when('/zahlungsimports/new', {
        templateUrl: 'scripts/zahlungsimports/import/zahlungsimports.html',
        controller: 'ZahlungsImportsController',
        name: 'ZahlungsImports',
        access: userRoles.Administrator
      })
      .when('/zahlungsimports/:id', {
        templateUrl: 'scripts/zahlungsimports/import/zahlungsimports.html',
        controller: 'ZahlungsImportsController',
        name: 'ZahlungsImports',
        access: userRoles.Administrator
      })
      .when('/settings', {
        templateUrl: 'scripts/projekt/settings/projektsettings.html',
        controller: 'ProjektSettingsController',
        name: 'ProjektSettings',
        access: userRoles.Administrator
      })
      .when('/vorlagen', {
        templateUrl: 'scripts/vorlagen/vorlagenoverview.html',
        controller: 'VorlagenOverviewController',
        name: 'VorlagenOverview',
        access: userRoles.Administrator
      });
  }]);
