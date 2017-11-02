'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ArbeitseinsatzabrechnungService', ['$rootScope', 'ArbeitseinsatzabrechnungModel',
    function($rootScope, ArbeitseinsatzabrechnungModel) {

      var arbeitseinsatzabrechnung;

      var load = function() {
        ArbeitseinsatzabrechnungModel.query({}, function(result) {
          arbeitseinsatzabrechnung = result;
        });
      };
      load();

      return {
        getArbeitseinsatzabrechnung: function() {
          return arbeitseinsatzabrechnung;
        }
      };
    }
  ]);
