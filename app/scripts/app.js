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
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('LIEFERRHYTHMEN', {
    WOECHENTLICH: 'Woechentlich',
    ZWEIWOECHENTLICH: 'Zweiwoechentlich',
    MONATLICH: 'Monatlich',
  })
  .constant('PREISEINHEITEN', {
    JAHR: 'Jahr',
    QUARTAL: 'Quartal',
    MONAT: 'Monat',
    LIEFERUNG: 'Lieferung'
  })
  .constant('VERTRIEBSARTEN', {
    DEPOTLIEFERUNG: 'Depotlieferung',
    HEIMLIEFERUNG: 'Heimlieferung',
    POSTLIEFERUNG: 'Postlieferung'
  })
  .constant('LIEFERZEITPUNKTE', {
    MONTAG: {id: 'Montag', label: {long: 'Montag', short: 'MO'}},
    DIENSTAG: {id: 'Dienstag', label: {long: 'Dienstag', short: 'DI'}},
    MITTWOCH: {id: 'Mittwoch', label: {long: 'Mittwoch', short: 'MI'}},
    DONNERSTAG: {id: 'Donnerstag', label: {long: 'Donnerstag', short: 'DO'}},
    FREITAG: {id: 'Freitag', label: {long: 'Freitag', short: 'FR'}},
    SAMSTAG: {id: 'Samstag', label: {long: 'Samstag', short: 'SA'}},
    SONNTAG: {id: 'Sonntag', label: {long: 'Sonntag', short: 'SO'}}
  })
  .constant('PERSONENTYPEN', {
    VEREINSMITGLIED: 'Vereinsmitglied',
    GOENNER: 'Goenner',
    GENOSSENSCHAFTERIN: 'Genossenschafterin'
  })
  .run(function($rootScope, $location) {
    $rootScope.location = $location;
  })
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
      .when('/personen', {
        templateUrl: 'scripts/personen/overview/personenoverview.html',
        controller: 'PersonenOverviewController',
        name: 'PersonenOverview'
      })
      .when('/personen/new', {
        templateUrl: 'scripts/personen/detail/personendetail.html',
        controller: 'PersonenDetailController',
        name: 'PersonenDetail'
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
      .when('/abos/new', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .when('/abos/:id', {
        templateUrl: 'scripts/abos/detail/abosdetail.html',
        controller: 'AbosDetailController',
        name: 'AbosDetail'
      })
      .otherwise({
        templateUrl: 'scripts/not-found.html'
      });
  });
