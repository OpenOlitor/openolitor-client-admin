'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferplanungDetailController', ['$scope', '$routeParams', 'ngTableParams', '$filter', 'LieferplanungModel', 'ProduzentenService', 'AbotypenOverviewModel', 'ProdukteService', 'LIEFEREINHEIT', 'cloneObj', 'gettext',
    function($scope, $routeParams, ngTableParams, $filter, LieferplanungModel, ProduzentenService, AbotypenOverviewModel, ProdukteService, LIEFEREINHEIT, cloneObj, gettext) {

      $scope.search = {
        query: ''
      };

      LieferplanungModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.planung = result;
      });

      $scope.produzentenL = [];

      //watch for set of produkte
      $scope.$watch(ProdukteService.getProdukte,
        function(list) {
          if (list) {
            $scope.produkteEntries = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.produkteEntries.push(item);
              }
            });

            $scope.tableParams.reload();
          }
      });

      $scope.extractProduzentenFilter = function(extract) {
        var produzentenRawL = [];
        angular.forEach($scope.alleProduzentenL, function(produzent) {
          if(angular.isUndefined(extract) || extract.indexOf(produzent.kurzzeichen) > -1) {
            produzentenRawL.push({
              'id': produzent.id,
              'title': produzent.kurzzeichen
            });
          }
        });
        return $filter('orderBy')(produzentenRawL, 'id');
      };

      $scope.$watch(ProduzentenService.getProduzenten,
        function(list) {
          if(angular.isUndefined($scope.alleProduzentenL)) {
            $scope.alleProduzentenL = list;
          }
        }
      );

      var getProduzent = function(produzentId) {
        var ret = {};
        angular.forEach($scope.alleProduzentenL, function(produzent) {
          if(produzent.id === produzentId) {
            ret = produzent;
            return;
          }
        });
        return ret;
      };

      var getProduzentByKurzzeichen = function(kurzzeichen) {
        var ret = {};
        angular.forEach($scope.alleProduzentenL, function(produzent) {
          if(produzent.kurzzeichen === kurzzeichen) {
            ret = produzent;
            return;
          }
        });
        return ret;
      };

      $scope.abotypenLieferungen = $scope.dummyAbotypLieferungEntries;

      $scope.displayMode = 'korbinhalt';

      $scope.produzentenL = [];

      $scope.bestellungen = {};

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10000,
          sorting: {
            name: 'asc'
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

            var produzentenRawL = [];
            angular.forEach(orderedData, function(item) {
              angular.forEach(item.produzenten, function(produzent) {
                produzentenRawL.push({
                  'id': produzent.id,
                  'title': produzent.id
                });
              });
            });
            $scope.produzentenL = $filter('orderBy')($filter('unique')(produzentenRawL, 'id'), 'id');

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.addAbotypenL = AbotypenOverviewModel.query({
        aktiv: true
      });

      $scope.addAbotypToPlanungFunc = function() {
        return $scope.addAbotypToPlanung;
      };

      $scope.addAbotypToPlanung = function(abotyp) {
        $scope.abotypenLieferungen.push({
          name: abotyp.name,
          lieferdatum: 'Di, 03.05.2016',  /* TODO muss später zur konkreten Lieferung passen*/
          zielpreis: abotyp.zielpreis,
          durchschnittspreis: 23.01,  /* TODO  muss später zur konkreten Lieferung passen*/
          anzahlLieferungen: 20,  /* TODO  muss später zur konkreten Lieferung passen*/
          anzahl: abotyp.anzahlAbonnenten, /* TODO  muss später zur konkreten Lieferung passen*/
          farbcode: abotyp.farbCode,
          korbEntries: []
        });
      };

      $scope.removeAbotypFromPlanung = function(abotypLieferung) {
        var index = $scope.abotypenLieferungen.indexOf(abotypLieferung);
        if (index > -1) {
          $scope.abotypenLieferungen.splice(index, 1);
        }
      };

      $scope.removeProdukt = function(abotypLieferung, korbprodukt) {
        var index = abotypLieferung.korbEntries.indexOf(korbprodukt);
        if (index > -1) {
          abotypLieferung.korbEntries.splice(index, 1);
          abotypLieferung.tableParamsKorb.reload();
        }
      };

      $scope.getTotal = function(produkteEntries) {
        var total = 0;
        angular.forEach(produkteEntries, function(korbprodukt) {
          if(angular.isDefined(korbprodukt.preisEinheit) && angular.isDefined(korbprodukt.menge)) {
            total += korbprodukt.preis;
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

      $scope.calculatePreis = function(korbprodukt) {
        korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
        return korbprodukt.preis;
      };

      $scope.getDurchschnittspreisInfo = function(abotypLieferung) {
        return gettext('# Lieferungen bisher: ') + abotypLieferung.anzahlLieferungen;
      };

      $scope.selectedProduzentFunc = function() {
        var selectedProduzent = function(produzent, korbprodukt) {
          korbprodukt.produzentId = produzent.id;
          korbprodukt.produzentKurzzeichen = produzent.title;
          return false; //not resetting dropdown
        };
        return selectedProduzent;
      };

      $scope.addTableParams = function(abotypLieferung) {
        if (!abotypLieferung.tableParamsKorb) {
          //use default tableParams
          abotypLieferung.tableParamsKorb = new ngTableParams({ // jshint ignore:line
            page: 1,
            count: 10000,
            sorting: {
              produktBeschrieb: 'asc'
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
        var drop = angular.element('#' + dropEl);
        var drag = angular.element('#' + dragEl);

        if(dragEl === dropEl || drag.scope().abotypLieferung === drop.scope().abotypLieferung) {
          return;
        }

        var notInKorb = function(korbEntries, prodEntry) {
          var ret = true;
          angular.forEach(korbEntries, function(entry) {
            if(prodEntry.produktBeschrieb === entry.produktBeschrieb) {
              ret = false;
              return;
            }
          });
          return ret;
        };

        switch(type) {
          case 'newProdukt':
            var prodUnlistet = {
              lieferungId: drop.scope().abotypLieferung.id,
              anzahl: drop.scope().abotypLieferung.anzahl,
              produktId: null,
              produktBeschrieb: null,
              preisEinheit: 0.0,
              preis: 0.0,
              menge: 1,
              einheit: LIEFEREINHEIT.KILOGRAMM,
              produzentenL: $scope.extractProduzentenFilter(),
              produzentId: undefined,
              produzentKurzzeichen: undefined,
              unlisted: true
            };
            drop.scope().abotypLieferung.korbEntries.push(prodUnlistet);
            break;
          case 'prod':
            var produkt = drag.scope().produkt;
            var produzent = (angular.isDefined(produkt.produzenten) && produkt.produzenten.length === 1) ? getProduzentByKurzzeichen(produkt.produzenten[0]) : {id: undefined, label: undefined};
            var prodEntry = {
              lieferungId: drop.scope().abotypLieferung.id,
              anzahl: drop.scope().abotypLieferung.anzahl,
              produktId: produkt.id,
              produktBeschrieb: produkt.name,
              preisEinheit: produkt.preis,
              menge: produkt.standardmenge,
              einheit: produkt.einheit,
              produzentenL: $scope.extractProduzentenFilter(produkt.produzenten),
              produzentId: produzent.id,
              produzentKurzzeichen: produzent.kurzzeichen
            };
            if(notInKorb(drop.scope().abotypLieferung.korbEntries, prodEntry)) { drop.scope().abotypLieferung.korbEntries.push(prodEntry); }
            break;
          case 'korbprod':
            var prodKorb = cloneObj(drag.scope().korbprodukt);
            if(notInKorb(drop.scope().abotypLieferung.korbEntries, prodKorb)) { drop.scope().abotypLieferung.korbEntries.push(prodKorb); }
            break;
          case 'korb':
            angular.forEach(drag.scope().abotypLieferung.korbEntries, function(produkt2add) {
              var prodEntry = cloneObj(produkt2add);
              if(notInKorb(drop.scope().abotypLieferung.korbEntries, prodEntry)) { drop.scope().abotypLieferung.korbEntries.push(prodEntry); }
            });
            break;
          default:
            //message?
        }

        drop.scope().abotypLieferung.tableParamsKorb.reload();
      };

      var addEntryToBestellungen = function(abotypLieferung, korbprodukt) {
        var produzent = korbprodukt.produzentKurzzeichen;
        if(angular.isUndefined(produzent)) {
          produzent = 'Noch nicht definierter Produzent';
        }

        if(angular.isUndefined($scope.bestellungen[produzent])) {
          var produzentObj = getProduzentByKurzzeichen(produzent);
          $scope.bestellungen[produzent] = {
            produzentId: produzentObj.id || undefined,
            produzentKurzzeichen: produzent,
            total: 0,
            steuer: 0,
            totalSteuer: 0,
            lieferungen: {}
          };
        }
        if(angular.isUndefined($scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum])) {
          $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum] = {
            datum: abotypLieferung.lieferdatum,
            positionen: {},
            total: 0,
            steuer: 0,
            totalSteuer: 0
          };
        }
        var anzahl = abotypLieferung.anzahl;
        if(!angular.isUndefined($scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].positionen[korbprodukt.produktBeschrieb + korbprodukt.menge])) {
          anzahl += $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].positionen[korbprodukt.produktBeschrieb + korbprodukt.menge].anzahl;
        }
        $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].positionen[korbprodukt.produktBeschrieb + korbprodukt.menge] = {
          anzahl: anzahl,
          produktBeschrieb: korbprodukt.produktBeschrieb,
          menge: korbprodukt.menge,
          einheit: korbprodukt.einheit,
          preisEinheit: korbprodukt.preisEinheit,
          preisPackung: (korbprodukt.preisEinheit * korbprodukt.menge),
          mengeTotal: (korbprodukt.menge * anzahl),
          preis: (korbprodukt.preisEinheit * korbprodukt.menge * anzahl)
        };
        $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].total += (korbprodukt.preisEinheit * korbprodukt.menge * anzahl);
        $scope.bestellungen[produzent].total += (korbprodukt.preisEinheit * korbprodukt.menge * anzahl);
        if($scope.produzentIstBesteuert(korbprodukt.produzentId)) {
          $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].steuer = ($scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].total / 100 * $scope.produzentSteuersatz(korbprodukt.produzentId));
          $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].totalSteuer = ($scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].total + $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].steuer);
          $scope.bestellungen[produzent].steuer = ($scope.bestellungen[produzent].total / 100 * $scope.produzentSteuersatz(korbprodukt.produzentId));
          $scope.bestellungen[produzent].totalSteuer = ($scope.bestellungen[produzent].total + $scope.bestellungen[produzent].steuer);
        } else {
          $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].steuer = 0;
          $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].totalSteuer = $scope.bestellungen[produzent].lieferungen[abotypLieferung.lieferdatum].total;
          $scope.bestellungen[produzent].steuer = 0;
          $scope.bestellungen[produzent].totalSteuer = $scope.bestellungen[produzent].total;
        }
      };

      $scope.recalculateBestellungen = function() {
        $scope.bestellungen = {};
        angular.forEach($scope.abotypenLieferungen, function(abotypLieferung) {
          angular.forEach(abotypLieferung.korbEntries, function(korbprodukt) {
            addEntryToBestellungen(abotypLieferung, korbprodukt);
          });
        });
      };

      $scope.hasMultipleLieferungen = function(bestellung) {
        return Object.keys(bestellung.lieferungen).length > 1;
      };

      $scope.produzentIstBesteuert = function(produzentId) {
        var prod = getProduzent(produzentId);
        return prod.mwst || false;
      };

      $scope.produzentSteuersatz = function(produzentId) {
        var prod = getProduzent(produzentId);
        return prod.mwstSatz || 0;
      };

    }
  ]);
