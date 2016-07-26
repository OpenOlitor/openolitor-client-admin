'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('LieferplanungModel', function($resource, API_URL) {
    return $resource(API_URL + 'lieferplanungen/:id', {
      id: '@id'
    }, {
      'getLieferungen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/lieferungen'
      },
      'addLieferung': {
        method: 'POST',
        isArray: true,
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
      'saveLieferpositionen': {
        method: 'POST',
        isArray: false,
        url: API_URL +
          'lieferplanungen/:id/lieferungen/:lieferungId/lieferpositionen'
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
      'getBestellungen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/bestellungen'
      },
      'bestellungenErstellen': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/bestellungen/create'
      },
      'getBestellpositionen': {
        method: 'GET',
        isArray: true,
        url: API_URL + 'lieferplanungen/:id/bestellungen/:bestellungId/positionen'
      },
      'bestellungVersenden': {
        method: 'POST',
        isArray: false,
        url: API_URL + 'lieferplanungen/:id/bestellungen/:bestellungId/aktionen/erneutBestellen'
      },
    });
  });
