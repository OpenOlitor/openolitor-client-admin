'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProdukteOverviewController', ['$q', '$scope', '$filter',
    'ProdukteModel', 'ProdukteService', 'ProduzentenService', 'ProduktekategorienService', 'ngTableParams', 'EnumUtil', 'cloneObj', 'LIEFEREINHEIT', 'MONATE',
    function($q, $scope, $filter, ProdukteModel, ProdukteService, ProduzentenService, ProduktekategorienService, ngTableParams, EnumUtil, cloneObj, LIEFEREINHEIT, MONATE) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.editing = false;

      $scope.search = {
        query: ''
      };

      $scope.monate = EnumUtil.asArray(MONATE);
      $scope.liefereinheiten = LIEFEREINHEIT;

      var defaults = {
        model: {
          id: undefined,
          name: '',
          verfuegbarVon: $scope.monate[0].id,
          verfuegbarBis: $scope.monate[11].id,
          kategorien: [],
          produzenten: [],
          einheit: LIEFEREINHEIT.KILOGRAMM.id,
          preis: 0.00,
          editable: true
        }
      };

      //watch for set of produktekategorien
      $scope.kategorienL = [];
      $scope.$watch(ProduktekategorienService.getProduktekategorien,
        function(list) {
          if (list) {
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.kategorienL.push({
                  'id': item.id,
                  'title': item.beschreibung
                });
              }
            });
            $scope.tableParams.reload();
          }
        });

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

      //watch for set of produkte
      $scope.$watch(ProdukteService.getProdukte,
        function(list) {
          if (list) {
            $scope.entries = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.entries.push(item);
              }
            });
            $scope.tableParams.reload();
          }
        });

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new ngTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function($defer, params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope
              .search.query);
            var orderedData = params.sorting ?
              $filter('orderBy')(filteredData, params.orderBy()) :
              filteredData;
            orderedData = $filter('filter')($scope.entries, params.filter());

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.produktErstellen = function() {
        if(angular.isUndefined($scope.entries)) {
          $scope.entries = [];
        }
        $scope.editing = true;
        var newProdukt = cloneObj(defaults.model);
        $scope.editingProdukt = newProdukt;
        $scope.entries.push(newProdukt);
        $scope.tableParams.reload();
      };

      $scope.edit = function(produkt) {
        produkt.editable = true;
        $scope.editingProdukt = produkt;
        $scope.editing = true;
      };

      $scope.save = function(produkt) {
        produkt.editable = false;
        $scope.editing = false;
        $scope.editingProdukt = undefined;
        $scope.produkt = new ProdukteModel(produkt);
        return $scope.produkt.$save();
      };

      $scope.delete = function(produkt) {
        produkt.editable = false;
        $scope.produkt = new ProdukteModel(produkt);
        return $scope.produkt.$delete();
      };

      $scope.getMonthShort = function(currMonth) {
        var month = {
          label : {short : ''}
        };
        angular.forEach(MONATE, function(monat) {
          if(monat.id === currMonth) {
            month = monat;
          }
        });
        return month.label.short;
      };

      $scope.removeProduzent = function(produkt, produzent) {
        angular.forEach(produkt.produzenten, function(value, key) {
          if(value === produzent) {
            produkt.produzenten.splice(key, 1);
          }
        });
      };

      $scope.removeKategorie = function(produkt, kategorie) {
        angular.forEach(produkt.kategorien, function(value, key) {
          if(value === kategorie) {
            produkt.kategorien.splice(key, 1);
          }
        });
      };

      $scope.addProduzentFunc = function() {
        var addProduzent = function(produzent) {
          if($scope.editingProdukt.produzenten.indexOf(produzent.title) === -1 ) {
            $scope.editingProdukt.produzenten.push(produzent.title);
          }
          return true; //reset dropdown
        };
        return addProduzent;
      };

      $scope.addKategorieFunc = function() {
        var addKategorie = function(kategorie) {
          if($scope.editingProdukt.kategorien.indexOf(kategorie.title) === -1 ) {
            $scope.editingProdukt.kategorien.push(kategorie.title);
          }
          return true; //reset dropdown
        };
        return addKategorie;
      };

    }
  ]);
