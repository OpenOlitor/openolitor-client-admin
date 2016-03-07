'use strict';

/**
 */
angular.module('openolitor')
  .controller('KorbplanungDetailController', ['$scope', 'ngTableParams', '$filter', 'ProduzentenService', 'AbotypenOverviewModel', 'cloneObj',
    function($scope, ngTableParams, $filter, ProduzentenService, AbotypenOverviewModel, cloneObj) {

      $scope.dummyProdukteEntries = [{
        id: '614275dc-29f5-4aa9-86eb-36ee873778b8',
        bezeichnung: 'Karotten',
        preis: 6.70,
        einheit: 'Kilo',
        produzenten: ['FH','D','AKJ','SA'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813778b8',
        bezeichnung: 'Kartoffeln',
        preis: 3.70,
        einheit: 'Kilo',
        produzenten: ['D','AKJ','SA'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813778b8',
        bezeichnung: 'Nüssler',
        preis: 1.80,
        einheit: '100g',
        produzenten: ['D','AKJ','FH'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Radiesli',
        preis: 4.10,
        einheit: 'Bund',
        produzenten: ['RAD'],
      }, {
        id: '614275dc-29f5-4aa9-86eb-36ee813178b8',
        bezeichnung: 'Peterli',
        preis: 3.80,
        einheit: 'Bund',
        produzenten: ['RAD'],
      }];

      $scope.dummyAbotypLieferungEntries = [{
        name: 'Vegan Gross',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 30,
        durchschnittspreis: 28.88,
        anzahlLieferungen: 20,
        anzahl: 12,
        korbEntries: []
      }, {
        name: 'Vegan Klein',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 23,
        durchschnittspreis: 23.01,
        anzahlLieferungen: 20,
        anzahl: 40,
        korbEntries: []
      }, {
        name: 'Vegi Gross',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 30,
        durchschnittspreis: 30.18,
        anzahlLieferungen: 20,
        anzahl: 17,
        korbEntries: []
      }, {
        name: 'Vegi Klein',
        lieferdatum: 'Di, 03.05.2016',
        zielpreis: 23,
        durchschnittspreis: 22.92,
        anzahlLieferungen: 20,
        anzahl: 91,
        korbEntries: []
      }, {
        name: 'Fleisch Gross',
        lieferdatum: 'Mi, 04.05.2016',
        zielpreis: 30,
        durchschnittspreis: 29.38,
        anzahlLieferungen: 20,
        anzahl: 4,
        korbEntries: []
      }, {
        name: 'Fleisch Klein',
        lieferdatum: 'Mi, 04.05.2016',
        zielpreis: 23,
        durchschnittspreis: 23.12,
        anzahlLieferungen: 20,
        anzahl: 62,
        korbEntries: []
      }];

      $scope.search = {
        query: ''
      };

      $scope.produkteEntries = $scope.dummyProdukteEntries;

      $scope.abotypenLieferungen = $scope.dummyAbotypLieferungEntries;

      $scope.displayMode = 'korbinhalt';

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

      $scope.addAbotypenL = AbotypenOverviewModel.query({
        aktiv: true
      });

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

      $scope.getDurchschnittspreis = function(abotypLieferung) {
        if(abotypLieferung.korbEntries.length === 0) {
          return abotypLieferung.durchschnittspreis;
        } else {
          return ((abotypLieferung.anzahlLieferungen * abotypLieferung.durchschnittspreis) + $scope.getTotal(abotypLieferung.korbEntries)) / (abotypLieferung.anzahlLieferungen + 1);
        }
      };

      $scope.getDurchschnittspreisInfo = function(abotypLieferung) {
        return $filter('translate')('# Lieferungen bisher: ') + abotypLieferung.anzahlLieferungen;
      };

      $scope.addTableParams = function(abotypLieferung) {
        if (!abotypLieferung.tableParamsKorb) {
          //use default tableParams
          abotypLieferung.tableParamsKorb = new ngTableParams({ // jshint ignore:line
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
              if (!abotypLieferung.korbEntries) {
                return;
              }
              // use build-in angular filter
              var filteredData = $filter('filter')(abotypLieferung.korbEntries,
                $scope.search.query);
              var orderedData = params.sorting ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

              params.total(orderedData.length);
              $defer.resolve(orderedData);
            }
          });
        }
      };

      angular.forEach($scope.abotypenLieferungen, function(abotypLieferung) {
        $scope.addTableParams(abotypLieferung);
      });

      $scope.dropProdukt = function(dragEl, dropEl, type) {

        if(dragEl === dropEl) {
          return;
        }

        var drop = angular.element('#' + dropEl);
        var drag = angular.element('#' + dragEl);

        switch(type) {
          case 'prod':
            var produkt = drag.scope().produkt;
            var produzent = (angular.isDefined(produkt.produzenten) && produkt.produzenten.length === 1) ? produkt.produzenten[0] : [];
            var prodEntry = {
              bezeichnung:produkt.bezeichnung,
              preisEinheit: produkt.preis,
              einheit: produkt.einheit,
              produzentenL: produkt.produzenten,
              produzent: produzent
            };
            drop.scope().abotypLieferung.korbEntries.push(prodEntry);
            break;
          case 'korbprod':
            var prodKorb = cloneObj(drag.scope().produkt);
            drop.scope().abotypLieferung.korbEntries.push(prodKorb);
            break;
          case 'korb':
            angular.forEach(drag.scope().abotypLieferung.korbEntries, function(produkt2add) {
              var prodEntry = cloneObj(produkt2add);
              drop.scope().abotypLieferung.korbEntries.push(prodEntry);
            });
            break;
          default:
            //message?
        }

        drop.scope().abotypLieferung.tableParamsKorb.reload();
      };

      $scope.recalulateBestellungen = function() {

      };

    }
  ]);
