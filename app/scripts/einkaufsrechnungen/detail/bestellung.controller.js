'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('BestellungDetailController', ['$scope', 'lodash',
    'EinkaufsrechnungenOverviewModel', 'ProduzentenService', 'LIEFEREINHEIT',

    function($scope, lodash, EinkaufsrechnungenOverviewModel, ProduzentenService,
      LIEFEREINHEIT) {
      $scope.liefereinheiten = LIEFEREINHEIT;

      $scope.$watch(ProduzentenService.getProduzenten,
        function(list) {
          if (angular.isUndefined($scope.alleProduzentenL)) {
            $scope.alleProduzentenL = list;
          }
        }
      );

      var loadDetail = function() {
          EinkaufsrechnungenOverviewModel.get({
          id: $scope.bestellungId
        }, function(sammelbestellung) {
          $scope.sammelbestellung = sammelbestellung;
        });
      };

      var unwatchId = $scope.$watch('bestellungId', function(id) {
        if (id && (!$scope.bestellung || $scope.bestellung.id !== id)) {
          loadDetail();
        }
      });

      var getProduzent = function(produzentId) {
        return lodash.find($scope.alleProduzentenL, function(produzent) {
          return produzent.id === produzentId;
        }) || {};
      };

      $scope.produzentIstBesteuert = function(produzentId) {
        var prod = getProduzent(produzentId);
        return prod.mwst || false;
      };

      $scope.produzentSteuersatz = function(produzentId) {
        var prod = getProduzent(produzentId);
        return prod.mwstSatz || 0;
      };

      $scope.$on('destroy', function() {
        unwatchId();
      });
    }
  ]);
