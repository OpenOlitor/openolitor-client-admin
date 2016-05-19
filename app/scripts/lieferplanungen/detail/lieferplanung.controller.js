'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferplanungDetailController', ['$scope', '$rootScope',
    '$routeParams', 'ngTableParams', '$filter', 'LieferplanungModel',
    'ProduzentenService', 'AbotypenOverviewModel', 'ProdukteService',
    'alertService', 'LIEFERSTATUS', 'LIEFEREINHEIT', 'msgBus', 'cloneObj',
    'gettext', '$location', 'lodash',
    function($scope, $rootScope, $routeParams, ngTableParams, $filter,
      LieferplanungModel, ProduzentenService, AbotypenOverviewModel,
      ProdukteService, alertService, LIEFERSTATUS, LIEFEREINHEIT, msgBus,
      cloneObj, gettext, $location, lodash) {

      $scope.liefereinheiten = LIEFEREINHEIT;

      $scope.search = {
        query: ''
      };

      LieferplanungModel.get({
        id: $routeParams.id
      }, function(result) {
        $scope.planung = result;
      });

      //watch for set of produkte
      $scope.$watch(ProdukteService.getProdukte,
        function(list) {
          if (list) {
            $scope.produkteEntries = [];
            lodash.forEach(list, function(item) {
              if (item.id) {
                $scope.produkteEntries.push(item);
              }
            });

            $scope.tableParams.reload();
          }
        });

      $scope.getProduktById = function(id) {
        lodash.find($scope.produkteEntries, function(produkt) {
          return (produkt.id === id);
        });
      };

      $scope.extractProduzentenFilter = function(extract) {
        var produzentenRawL = [];
        lodash.forEach($scope.alleProduzentenL, function(produzent) {
          if (angular.isUndefined(extract) || extract.indexOf(produzent
              .kurzzeichen) > -1) {
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
          if (angular.isUndefined($scope.alleProduzentenL)) {
            $scope.alleProduzentenL = list;
          }
        }
      );

      LieferplanungModel.getLieferungen({
        id: $routeParams.id
      }, function(result) {
        $scope.abotypenLieferungen = result;
        lodash.forEach($scope.abotypenLieferungen, function(
          abotypenLieferung) {
          abotypenLieferung.korbEntries = [];
          LieferplanungModel.getLieferpositionen({
            id: $routeParams.id,
            lieferungId: abotypenLieferung.id
          }, function(result) {
            abotypenLieferung.korbEntries = result;
            lodash.forEach(abotypenLieferung.korbEntries,
              function(korbEntry) {
                var prod = $scope.getProduktById(korbEntry.produktId);
                var produzenten = angular.isUndefined(prod) ?
                  undefined : prod.produzenten;
                korbEntry.produzentenL = $scope.extractProduzentenFilter(
                  produzenten);
              });
            $scope.addTableParams(abotypenLieferung);
          });
        });
      });

      var getProduzent = function(produzentId) {
        return lodash.find($scope.alleProduzentenL, function(produzent) {
          return produzent.id === produzentId;
        }) || {};
      };

      var getProduzentByKurzzeichen = function(kurzzeichen) {
        return lodash.find($scope.alleProduzentenL, function(produzent) {
          return (produzent.kurzzeichen === kurzzeichen);
        }) || {};
      };

      $scope.getShortEinheit = function(einheitId) {
        var liefereinheit = lodash.find($scope.liefereinheiten, function(
          liefereinheit) {
          return (liefereinheit.id === einheitId);
        });
        return !liefereinheit || liefereinheit.label.short;
      };

      $scope.displayMode = 'korbinhalt';

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
            lodash.forEach(orderedData, function(item) {
              lodash.forEach(item.produzenten, function(produzent) {
                produzentenRawL.push({
                  'id': produzent.id,
                  'title': produzent.id
                });
              });
            });
            $scope.produzentenL = $filter('orderBy')($filter('unique')(
              produzentenRawL, 'id'), 'id');

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.fetchNichtInkludierteLieferungen = function() {
        LieferplanungModel.getNichtInkludierteAbotypenLieferungen({
          id: $routeParams.id
        }, function(result) {
          $scope.addAbotypenL = result;
        });
      };
      $scope.fetchNichtInkludierteLieferungen();

      $scope.lieferung2add = function(addAbotyp) {
        return addAbotyp.abotypBeschrieb + ' ' + addAbotyp.vertriebsartBeschrieb +
          ' ' + $filter('date')(addAbotyp.datum);
      };

      $scope.addAbotypToPlanungFunc = function() {
        return $scope.addAbotypToPlanung;
      };

      $scope.addAbotypToPlanung = function(abotypLieferung) {
        $scope.addAbotypenL.pop(abotypLieferung);

        abotypLieferung.korbEntries = [];
        $scope.addTableParams(abotypLieferung);
        abotypLieferung.lieferplanungId = $scope.planung.id;
        $scope.abotypenLieferungen.push(abotypLieferung);
        LieferplanungModel.addLieferung({
          id: $routeParams.id,
          lieferungId: abotypLieferung.id
        }, abotypLieferung);
        return true;
      };

      $scope.removeAbotypFromPlanung = function(abotypLieferung) {
        var index = $scope.abotypenLieferungen.indexOf(abotypLieferung);
        if (index > -1) {
          $scope.abotypenLieferungen.splice(index, 1);
        }
        return LieferplanungModel.removeLieferung({
          id: $routeParams.id,
          lieferungId: abotypLieferung.id
        }, []);
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
        lodash.forEach(produkteEntries, function(korbprodukt) {
          if (angular.isDefined(korbprodukt.preisEinheit) && angular.isDefined(
              korbprodukt.menge)) {
            if (angular.isUndefined(korbprodukt.preis)) {
              $scope.calculatePreis(korbprodukt);
            }
            total += korbprodukt.preis;
          }
        });
        return total;
      };

      $scope.getDiff = function(aboZielpreis, produkteEntries) {
        return aboZielpreis - $scope.getTotal(produkteEntries);
      };

      $scope.setMode = function(mode) {
        $scope.displayMode = mode;
      };

      $scope.getDurchschnittspreis = function(abotypLieferung) {
        if (angular.isUndefined(abotypLieferung.korbEntries) ||
          abotypLieferung.korbEntries.length === 0) {
          return abotypLieferung.durchschnittspreis;
        } else {
          return ((abotypLieferung.anzahlLieferungen * abotypLieferung.durchschnittspreis) +
            $scope.getTotal(abotypLieferung.korbEntries)) / (
            abotypLieferung.anzahlLieferungen + 1);
        }
      };

      $scope.calculatePreis = function(korbprodukt) {
        korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
        return korbprodukt.preis;
      };

      $scope.getDurchschnittspreisInfo = function(abotypLieferung) {
        return gettext('# Lieferungen bisher: ') + abotypLieferung.anzahlLieferungen;
      };

      $scope.isInvalid = function(korbprodukt) {
        return !korbprodukt.produzentId;
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

      $scope.dropProdukt = function(dragEl, dropEl, type) {
        if (!$scope.valuesEditable()) {
          alertService.addAlert('lighterror', gettext(
            'Die Lieferungen dürfen nicht mehr verändert werden.'));
          $scope.$apply();
          return;
        }

        var drop = angular.element('#' + dropEl);
        var drag = angular.element('#' + dragEl);

        if (dragEl === dropEl || drag.scope().abotypLieferung === drop.scope()
          .abotypLieferung) {
          return;
        }

        var notInKorb = function(korbEntries, prodEntry) {
          return lodash.find(korbEntries, function(entry) {
            return (prodEntry.produktBeschrieb === entry.produktBeschrieb);
          }) === undefined;
        };

        switch (type) {
          case 'newProdukt':
            var prodUnlistet = {
              lieferungId: drop.scope().abotypLieferung.id,
              anzahl: drop.scope().abotypLieferung.anzahlKoerbeZuLiefern,
              produktId: null,
              produktBeschrieb: null,
              preisEinheit: 0.0,
              preis: 0.0,
              menge: 1,
              einheit: LIEFEREINHEIT.KILOGRAMM.id,
              produzentenL: $scope.extractProduzentenFilter(),
              produzentId: undefined,
              produzentKurzzeichen: undefined,
              unlisted: true
            };
            drop.scope().abotypLieferung.korbEntries.push(prodUnlistet);
            break;
          case 'prod':
            var produkt = drag.scope().produkt;
            var produzent = (angular.isDefined(produkt.produzenten) &&
                produkt.produzenten.length === 1) ?
              getProduzentByKurzzeichen(produkt.produzenten[0]) : {
                id: undefined,
                label: undefined
              };
            var prodEntry = {
              lieferungId: drop.scope().abotypLieferung.id,
              anzahl: drop.scope().abotypLieferung.anzahlKoerbeZuLiefern,
              produktId: produkt.id,
              produktBeschrieb: produkt.name,
              preisEinheit: produkt.preis,
              menge: produkt.standardmenge,
              einheit: produkt.einheit,
              produzentenL: $scope.extractProduzentenFilter(produkt.produzenten),
              produzentId: produzent.id,
              produzentKurzzeichen: produzent.kurzzeichen
            };
            if (notInKorb(drop.scope().abotypLieferung.korbEntries,
                prodEntry)) {
              drop.scope().abotypLieferung.korbEntries.push(prodEntry);
            }
            break;
          case 'korbprod':
            var prodKorb = cloneObj(drag.scope().korbprodukt);
            if (notInKorb(drop.scope().abotypLieferung.korbEntries,
                prodKorb)) {
              drop.scope().abotypLieferung.korbEntries.push(prodKorb);
            }
            break;
          case 'korb':
            lodash.forEach(drag.scope().abotypLieferung.korbEntries,
              function(produkt2add) {
                var prodEntry = cloneObj(produkt2add);
                if (notInKorb(drop.scope().abotypLieferung.korbEntries,
                    prodEntry)) {
                  drop.scope().abotypLieferung.korbEntries.push(prodEntry);
                }
              });
            break;
          default:
            //message?
        }

        drop.scope().abotypLieferung.tableParamsKorb.reload();
      };

      var addEntryToBestellungen = function(abotypLieferung, korbprodukt) {
        var produzent = korbprodukt.produzentKurzzeichen;
        if (angular.isUndefined(produzent)) {
          produzent = 'Noch nicht definierter Produzent';
        }

        var bestellungByProduzent = $scope.bestellungen[produzent];
        if (angular.isUndefined(bestellungByProduzent)) {
          var produzentObj = getProduzentByKurzzeichen(produzent);
          bestellungByProduzent = $scope.bestellungen[produzent] = {
            produzentId: produzentObj.id || undefined,
            produzentKurzzeichen: produzent,
            total: 0,
            steuer: 0,
            totalSteuer: 0,
            lieferungen: {}
          };
        }
        var lieferungByProduzent = bestellungByProduzent.lieferungen[
          abotypLieferung.datum];
        if (angular.isUndefined(lieferungByProduzent)) {
          lieferungByProduzent = bestellungByProduzent.lieferungen[
            abotypLieferung.datum] = {
            datum: abotypLieferung.datum,
            positionen: {},
            total: 0,
            steuer: 0,
            totalSteuer: 0
          };
        }
        var anzahl = abotypLieferung.anzahlKoerbeZuLiefern;
        if (!angular.isUndefined(lieferungByProduzent.positionen[
            korbprodukt.produktBeschrieb +
            korbprodukt.menge])) {
          anzahl += lieferungByProduzent.positionen[korbprodukt.produktBeschrieb +
            korbprodukt.menge].anzahl;
        }
        lieferungByProduzent.positionen[
          korbprodukt.produktBeschrieb + korbprodukt.menge] = {
          anzahl: anzahl,
          produktBeschrieb: korbprodukt.produktBeschrieb,
          menge: korbprodukt.menge,
          einheit: korbprodukt.einheit,
          preisEinheit: korbprodukt.preisEinheit,
          preisPackung: (korbprodukt.preisEinheit * korbprodukt.menge),
          mengeTotal: (korbprodukt.menge * anzahl),
          preis: (korbprodukt.preisEinheit * korbprodukt.menge * anzahl)
        };
        lieferungByProduzent.total +=
          (korbprodukt.preisEinheit * korbprodukt.menge * anzahl);
        bestellungByProduzent.total += (korbprodukt.preisEinheit *
          korbprodukt.menge * anzahl);

        if ($scope.produzentIstBesteuert(korbprodukt.produzentId)) {
          lieferungByProduzent.steuer = (lieferungByProduzent.total / 100 *
            $scope.produzentSteuersatz(
              korbprodukt.produzentId));
          lieferungByProduzent.totalSteuer = (lieferungByProduzent.total +
            lieferungByProduzent.steuer);

          bestellungByProduzent.steuer = (bestellungByProduzent.total / 100 *
            $scope.produzentSteuersatz(
              korbprodukt.produzentId));
          bestellungByProduzent.totalSteuer = (bestellungByProduzent.total +
            bestellungByProduzent.steuer);
        } else {
          lieferungByProduzent.steuer = 0;
          lieferungByProduzent.totalSteuer = lieferungByProduzent.total;
          bestellungByProduzent.steuer = 0;
          bestellungByProduzent.totalSteuer = bestellungByProduzent.total;
        }
      };

      $scope.recalculateBestellungen = function() {
        $scope.bestellungen = {};
        lodash.forEach($scope.abotypenLieferungen, function(abotypLieferung) {
          lodash.forEach(abotypLieferung.korbEntries, function(
            korbprodukt) {
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

      $scope.save = function() {
        if ($scope.checkAllValues()) {
          $scope.editNachAbgeschlossen = false;
          lodash.forEach($scope.abotypenLieferungen, function(
            abotypLieferung) {
            LieferplanungModel.saveLieferpositionen({
              id: $routeParams.id,
              lieferungId: abotypLieferung.id
            }, {
              lieferungId: abotypLieferung.id,
              lieferpositionen: abotypLieferung.korbEntries
            });
          });
          return $scope.planung.$save();
        } else {
          return 'Noop';
        }
      };

      $scope.checkAllValues = function() {
        var ret = true;
        //check on Produzent on all Produkte
        lodash.forEach($scope.abotypenLieferungen, function(abotypLieferung) {
          lodash.forEach(abotypLieferung.korbEntries, function(
            korbEntry) {
            if (ret && angular.isUndefined(korbEntry.produzentId)) {
              ret = false;
              alertService.addAlert('lighterror', gettext(
                'Für jedes Produkt muss ein Produzent ausgewählt sein.'
              ));
            }
            if (ret && angular.isUndefined(korbEntry.produktBeschrieb)) {
              ret = false;
              alertService.addAlert('lighterror', gettext(
                'Jedes Produkt muss über eine Beschreibung verfügen.'
              ));
            }
          });
        });
        return ret;
      };

      $scope.backToList = function() {
        $location.path('/lieferplanung');
      };

      $scope.editNachAbgeschlossen = false;

      $scope.valuesEditable = function() {
        if (angular.isUndefined($scope.planung)) {
          return false;
        } else {
          return $scope.planung.status === LIEFERSTATUS.OFFEN || $scope.editNachAbgeschlossen;
        }
      };

      $scope.planungAbschliessen = function() {
        LieferplanungModel.abschliessen({
          id: $routeParams.id
        }, function() {
          $scope.planung.status = LIEFERSTATUS.ABGESCHLOSSEN;
        });
      };

      $scope.planungVerrechnen = function() {
        LieferplanungModel.verrechnen({
          id: $routeParams.id
        }, function() {
          $scope.planung.status = LIEFERSTATUS.VERRECHNET;
        });
      };

      $scope.bestellungVersenden = function(bestellungId) {
        LieferplanungModel.bestellungVersenden({
          id: $routeParams.id,
          bestellungId: bestellungId
        }, function() {

        });
      };

      $scope.bestellungenErstellen = function() {
        LieferplanungModel.bestellungenErstellen({
          id: $routeParams.id
        }, function() {

        });
      };

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Lieferplanung') {
          $rootScope.$apply();
        }
      });
    }
  ]);
