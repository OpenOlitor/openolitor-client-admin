'use strict';

/**
 */
angular.module('openolitor')
  .controller('KorbplanungDetailController', ['$scope', 'ngTableParams', '$filter', 'ProduzentenService',
    function($scope, ngTableParams, $filter, ProduzentenService) {
      $scope.test = [];

      $scope.dummyProdukteEntries = [{
        id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
        bezeichnung: 'Karotten',
        preis: '6.70 / Kilo',
        produzenten: ['FH','D','AKJ','SA'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813778b8',
        bezeichnung: 'Kartoffeln',
        preis: '3.70 / Kilo',
        produzenten: ['D','AKJ','SA'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: '4.10 / Bund',
        produzenten: ['RAD'],
      }];

      $scope.dummyKorbEntries = [{
        id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
        bezeichnung: 'Nüssler',
        preisEinheit: 0.027,
        einheit: 'g',
        produzent: 'FH'
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813778b8',
        bezeichnung: 'Kartoffeln',
        preisEinheit: 6.7,
        einheit: 'kg',
        produzent: 'FH'
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preisEinheit: 4.1,
        einheit: 'Bund',
        produzent: 'RAD'
      }];

      $scope.dummyAboEntries = [{
        name: 'Vegan Gross',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 30
      }, {
        name: 'Vegan Klein',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 23
      }, {
        name: 'Vegi Gross',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 30
      }, {
        name: 'Vegi Klein',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 23
      }, {
        name: 'Fleisch Gross',
        lieferdatum: 'Mi, 04.05.2016',
        zielpreis: 30
      }, {
        name: 'Fleisch Klein',
        lieferdatum: 'Mi, 04.05.2016',
        zielpreis: 23
      }];

      $scope.search = {
        query: ''
      };

      $scope.produkteEntries = $scope.dummyProdukteEntries;

      $scope.korbEntries = $scope.dummyKorbEntries;

      $scope.abotypen = $scope.dummyAboEntries;

      //watch for set of produzenten
      $scope.produzentenL = [];
      $scope.$watch(ProduzentenService.getProduzenten,
        function(list) {
          if (list) {
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.produzentenL.push({
                  'id': item.id,
                  'title': item.kurzzeichen
                });
              }
            });
            $scope.tableParams.reload();
          }
        });

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10000,
          sorting: {
            bezeichnung: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.produkteEntries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.produkteEntries,
              $scope.search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')(orderedData, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.getTotal = function(produkteEntries) {
        var total = 0;
        angular.forEach(produkteEntries, function(korbprodukt) {
          if(angular.isDefined(korbprodukt.preisEinheit) && angular.isDefined(korbprodukt.menge)) {
            total += korbprodukt.preisEinheit * korbprodukt.menge;
          }
        });
        return total;
      };

      $scope.getDiff = function(aboZielpreis, produkteEntries) {
        return aboZielpreis - $scope.getTotal(produkteEntries);
      };

      if (!$scope.tableParamsKorb) {
        //use default tableParams
        $scope.tableParamsKorb = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10000,
          sorting: {
            bezeichnung: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.korbEntries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.korbEntries,
              $scope.search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.dragOver = function(ev) {
        ev.preventDefault();
      };

      $scope.dragOut = function(ev) {
        ev.preventDefault();
      };

      $scope.dragProdukt = function(ev, produkt) {
        $scope.ddData = [{bezeichnung:$scope.produkteEntries[0].bezeichnung, preisEinheit: 0.027, einheit: 'g', produzent: []}];
      };

      $scope.dragAbotyp = function(ev, abotyp) {
        $scope.ddData = [];
        angular.forEach($scope.korbEntries, function(produkt2add) {
          $scope.ddData.push({bezeichnung:produkt2add.bezeichnung, preisEinheit: 0.027, einheit: 'g', produzent: []});
        });
      };

      $scope.drop = function(ev) {
          ev.preventDefault();
          $scope.korbEntries = $scope.korbEntries.concat($scope.ddData);

          $scope.ddData = undefined;
          $scope.tableParamsKorb.reload();
      };

    }
  ]);
