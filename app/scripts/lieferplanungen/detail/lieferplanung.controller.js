'use strict';

/**
 */
angular.module('openolitor')
  .controller('LieferplanungDetailController', ['$scope', '$rootScope',
    '$routeParams', 'NgTableParams', '$filter', 'LieferplanungModel',
    'ProduzentenService', 'AbotypenOverviewModel', 'ProdukteService',
    'alertService', 'dialogService', 'LIEFERSTATUS', 'LIEFEREINHEIT', 'msgBus', 'cloneObj',
    'gettext', '$location', 'lodash', '$uibModal',
    function($scope, $rootScope, $routeParams, NgTableParams, $filter,
      LieferplanungModel, ProduzentenService, AbotypenOverviewModel,
      ProdukteService, alertService, dialogService, LIEFERSTATUS, LIEFEREINHEIT, msgBus,
      cloneObj, gettext, $location, lodash, $uibModal) {

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

      $scope.getProduzentByKurzzeichen = function(kurzzeichen) {
        return lodash.find($scope.alleProduzentenL, function(produzent) {
          return (produzent.kurzzeichen === kurzzeichen);
        }) || {};
      };

      $scope.extractProduzentenFilter = function(extract, useKz) {
        var produzentenRawL = [];
        lodash.forEach($scope.alleProduzentenL, function(produzent) {
          if (angular.isUndefined(extract) || extract.indexOf(produzent
              .kurzzeichen) > -1) {
            produzentenRawL.push({
              'id': (useKz) ? produzent.kurzzeichen : produzent.id,
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

          lodash.forEach(abotypenLieferung.lieferpositionen,
            function(pos) {
              var prod = $scope.getProduktById(pos.produktId);
              var produzenten = angular.isUndefined(prod) ?
                undefined : prod.produzenten;
              pos.produzentenL = $scope.extractProduzentenFilter(
                produzenten);
            });
          $scope.addTableParams(abotypenLieferung);
        });
      });

      var getProduzent = function(produzentId) {
        return lodash.find($scope.alleProduzentenL, function(produzent) {
          return produzent.id === produzentId;
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
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10000,
          sorting: {
            name: 'asc'
          },
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.produkteEntries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.produkteEntries,
              $scope.search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')(orderedData, params.filter(), false);
            params.total(orderedData.length);
            return orderedData;
          }

        });
      }

      $scope.fetchVerfuegbareLieferungen = function() {
        LieferplanungModel.getVerfuegbareLieferungen({
          id: $routeParams.id
        }, function(result) {
          $scope.verfuegbareLieferungen = result;
        });
      };
      $scope.fetchVerfuegbareLieferungen();

      $scope.lieferung2add = function(addAbotyp) {
        var optionalBeschrieb = addAbotyp.vertriebsartBeschrieb || '';
        return addAbotyp.abotypBeschrieb + ' ' + optionalBeschrieb +
          ' ' + $filter('date')(addAbotyp.datum);
      };

      $scope.addAbotypToPlanungFunc = function() {
        return $scope.addAbotypToPlanung;
      };

      $scope.addAbotypToPlanung = function(abotypLieferung) {

        var index = $scope.verfuegbareLieferungen.indexOf(abotypLieferung);
        $scope.verfuegbareLieferungen.splice(index, 1);

        abotypLieferung.lieferpositionen = [];
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

        $scope.verfuegbareLieferungen.push(abotypLieferung);

        if (abotypLieferung.id) {
          return LieferplanungModel.removeLieferung({
            id: $routeParams.id,
            lieferungId: abotypLieferung.id
          }, []);
        }
      };

      $scope.removeProdukt = function(abotypLieferung, korbprodukt) {
        var index = abotypLieferung.lieferpositionen.indexOf(korbprodukt);
        if (index > -1) {
          abotypLieferung.lieferpositionen.splice(index, 1);
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
        if (angular.isUndefined(abotypLieferung.lieferpositionen) ||
          abotypLieferung.lieferpositionen.length === 0) {
          return abotypLieferung.durchschnittspreis;
        } else {
          return ((abotypLieferung.anzahlLieferungen * abotypLieferung.durchschnittspreis) +
            $scope.getTotal(abotypLieferung.lieferpositionen)) / (
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
        return !korbprodukt.produzentId || !korbprodukt.produktBeschrieb;
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
          abotypLieferung.tableParamsKorb = new NgTableParams({ // jshint ignore:line
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
            getData: function(params) {
              if (!abotypLieferung.lieferpositionen) {
                return;
              }
              // use build-in angular filter
              var filteredData = $filter('filter')(abotypLieferung.lieferpositionen,
                $scope.search.query);
              var orderedData = params.sorting ?
                $filter('orderBy')(filteredData, params.orderBy()) :
                filteredData;

              params.total(orderedData.length);
              return orderedData;
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

        var checkOnDuplicateAndAskExec = function(newEntry) {
          drop.scope().abotypLieferung.lieferpositionen.push(newEntry);
          drop.scope().abotypLieferung.tableParamsKorb.reload();
        };

        var checkOnDuplicateAndAsk = function(lieferpositionen, newEntry) {
          var exists = lodash.find(lieferpositionen, function(entry) {
            return (newEntry.produktBeschrieb === entry.produktBeschrieb);
          });
          if(exists) {
            dialogService.displayDialogOkAbort(gettext('Ein solches Produkt befindet sich schon in diesem Korb. Soll es dennoch eingefügt werden?'),
            function() {
              checkOnDuplicateAndAskExec(newEntry);
            });
          } else {
            checkOnDuplicateAndAskExec(newEntry);
          }
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
            drop.scope().abotypLieferung.lieferpositionen.push(prodUnlistet);
            break;
          case 'prod':
            var produkt = drag.scope().produkt;
            var produzent = (angular.isDefined(produkt.produzenten) &&
                produkt.produzenten.length === 1) ?
              $scope.getProduzentByKurzzeichen(produkt.produzenten[0]) : {
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
            checkOnDuplicateAndAsk(drop.scope().abotypLieferung.lieferpositionen,
                prodEntry);
            break;
          case 'korbprod':
            var prodKorb = cloneObj(drag.scope().korbprodukt);
            checkOnDuplicateAndAsk(drop.scope().abotypLieferung.lieferpositionen,
                prodKorb);
            break;
          case 'korb':
            lodash.forEach(drag.scope().abotypLieferung.lieferpositionen,
              function(produkt2add) {
                var prodEntry = cloneObj(produkt2add);
                checkOnDuplicateAndAsk(drop.scope().abotypLieferung.lieferpositionen,
                    prodEntry);
              });
            break;
          default:
            //message?
        }
      };

      var addEntryToBestellungen = function(abotypLieferung, korbprodukt) {
        var produzent = korbprodukt.produzentKurzzeichen;
        if (angular.isUndefined(produzent)) {
          produzent = 'Noch nicht definierter Produzent';
        }

        var bestellungByProduzent = $scope.bestellungen[produzent];
        if (angular.isUndefined(bestellungByProduzent)) {
          var produzentObj = $scope.getProduzentByKurzzeichen(produzent);
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
        var recalculate = function() {
          $scope.bestellungen = {};
          if($scope.planung.status === 'Offen') {
            lodash.forEach($scope.abotypenLieferungen, function(abotypLieferung) {
              lodash.forEach(abotypLieferung.lieferpositionen, function(
                korbprodukt) {
                addEntryToBestellungen(abotypLieferung, korbprodukt);
              });
            });
          } else {
            LieferplanungModel.getBestellungen({
              id: $routeParams.id
            }, function(bestellungen) {
              angular.forEach(bestellungen, function(bestellung) {
                $scope.bestellungen[bestellung.produzentKurzzeichen] = {
                  id: bestellung.id,
                  produzentId: bestellung.produzentId,
                  produzentKurzzeichen: bestellung.produzentKurzzeichen,
                  total: (($scope.bestellungen[bestellung.produzentKurzzeichen]) ? $scope.bestellungen[bestellung.produzentKurzzeichen].total : 0) + bestellung.preisTotal,
                  steuer: bestellung.steuer,
                  totalSteuer: (($scope.bestellungen[bestellung.produzentKurzzeichen]) ? $scope.bestellungen[bestellung.produzentKurzzeichen].totalSteuer : 0) + bestellung.totalSteuer,
                  lieferungen: {}
                };
                $scope.bestellungen[bestellung.produzentKurzzeichen].lieferungen[bestellung.datum] = {
                  id: bestellung.id,
                  datum: bestellung.datum,
                  positionen: {},
                  total: bestellung.preisTotal,
                  steuer: bestellung.steuer,
                  totalSteuer: bestellung.totalSteuer
                };
                LieferplanungModel.getBestellpositionen({
                  id: $routeParams.id,
                  bestellungId: bestellung.id
                }, function(bestellpositionen) {
                  angular.forEach(bestellpositionen, function(bestellposition) {
                    $scope.bestellungen[bestellung.produzentKurzzeichen].lieferungen[bestellung.datum].positionen[bestellposition.produktBeschrieb + bestellposition.menge] = {
                      anzahl: bestellposition.anzahl,
                      produktBeschrieb: bestellposition.produktBeschrieb,
                      menge: bestellposition.menge,
                      einheit: bestellposition.einheit,
                      preisEinheit: bestellposition.preisEinheit,
                      preisPackung: (bestellposition.preisEinheit * bestellposition.menge),
                      mengeTotal: (bestellposition.menge * bestellposition.anzahl),
                      preis: bestellposition.preis
                    };
                  });
                });
              });
            });
          }
        };

        if($scope.valuesEditable() && $scope.planung.status !== 'Offen') {
          LieferplanungModel.bestellungenErstellen({
            id: $routeParams.id,
            lieferplanungId: parseInt($routeParams.id)
          }, function() { recalculate(); });
        } else {
          recalculate();
        }
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
              lieferpositionen: abotypLieferung.lieferpositionen
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
          lodash.forEach(abotypLieferung.lieferpositionen, function(
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

      $scope.delete = function() {
        return $scope.planung.$delete();
      };

      $scope.editNachAbgeschlossen = false;

      $scope.setEditableNachAbgeschlossen = function() {
        $scope.editNachAbgeschlossen = true;
      };

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

      $scope.bestellungVersenden = function(bestellung) {
        LieferplanungModel.bestellungVersenden({
          id: $routeParams.id,
          bestellungId: bestellung.id
        }, bestellung);
      };

      $scope.bestellungenErstellen = function() {
        LieferplanungModel.bestellungenErstellen({
          id: $routeParams.id
        }, function() {

        });
      };

      $scope.editBemerkungen = function() {
        $scope.modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/lieferplanungen/detail/edit-bemerkungen.html',
          scope: $scope
        });

        $scope.modalInstance.result.then(function() {
          $scope.modalInstance = undefined;
        }, function() {

        });
      };

      $scope.closeEditBemerkungen = function() {
        $scope.modalInstance.close();
      };

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Lieferplanung') {
          $rootScope.$apply();
        }
      });
    }
  ]);
