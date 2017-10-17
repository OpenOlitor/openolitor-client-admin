'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferplanungModel', ['$resource', 'API_URL', 'exportODSModuleFunction', function($resource, API_URL, exportODSModuleFunction) {
    return $resource(API_URL + 'lieferplanungen/:id:exportType', {
      id: '@id'
    }, {
      'exportODS': exportODSModuleFunction,
      'getLieferungen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/lieferungen'
      },
      'addLieferung': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/lieferungen/:lieferungId'
      },
      'removeLieferung': {
        method: 'DELETE',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/lieferungen/:lieferungId'
      },
      'getLieferpositionen': {
        method: 'GET',
        isArray: true,
        url: API_URL +
          'lieferplanungen/:id/lieferungen/:lieferungId/lieferpositionen'
      },
      'modifyLieferplanungData': {
        method: 'POST',
        isArray: false,
        url: API_URL +
          'lieferplanungen/:id/aktionen/modifizieren'
      },
      'getVerfuegbareLieferungen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/getVerfuegbareLieferungen'
      },
      'abschliessen': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/aktionen/abschliessen'
      },
      'verrechnen': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/aktionen/verrechnen'
      },
      'getSammelbestellungen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/sammelbestellungen'
      },
      'sammelbestellungenErstellen': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/sammelbestellungen/create'
      },
      'getBestellpositionen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/sammelbestellungen/:sammelbestellungId/bestellung/:bestellungId/positionen'
      },
      'sammelbestellungVersenden': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/sammelbestellungen/:bestellungId/aktionen/erneutBestellen'
      },
      'getAboIdsByKorbStatus': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/lieferungen/:lieferungId/:korbStatus/aboIds'
      },
      'getZusatzaboIdsByKorbStatus': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/lieferungen/:lieferungId/:korbStatus/hauptaboIds'
      },
      'getAllAboIdsByKorbStatus': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/:korbStatus/aboIds'
      },
      'getAllAuslieferungenByLieferplanungId': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/auslieferungen'
      },
    });
  }]);
