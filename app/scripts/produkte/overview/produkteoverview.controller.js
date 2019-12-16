'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProdukteOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    'ProdukteModel', 'ProdukteService', 'ProduzentenService', 'ProduktekategorienService',
    'NgTableParams', 'EnumUtil', 'cloneObj', 'LIEFEREINHEIT', 'MONATE', 'lodash',
    'localeSensitiveComparator',
    function($q, $scope, $rootScope, $filter, ProdukteModel, ProdukteService, ProduzentenService,
      ProduktekategorienService, NgTableParams, EnumUtil, cloneObj, LIEFEREINHEIT,
      MONATE, lodash, localeSensitiveComparator) {
      $rootScope.viewId = 'L-Pkt';

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
          var unorderedkategorienL = [];
          if (list) {
            angular.forEach(list, function(item) {
              if (item.id) {
                unorderedkategorienL.push({
                  'id': item.beschreibung,
                  'title': item.beschreibung
                });
              }
            });
            angular.forEach(lodash.sortBy(unorderedkategorienL, function(kl){
                return kl.id.toLowerCase();
            }), function(item){
                $scope.kategorienL.push(item);
            });
            $scope.tableParams.reload();
          }
        });

      //watch for set of produzenten
      $scope.produzentenL = [];
      $scope.$watch(ProduzentenService.getProduzenten,
        function(list) {
          var unorderedProduzentenL = [];
          if (list) {
            angular.forEach(list, function(item) {
              if (item.id) {
                unorderedProduzentenL.push({
                  'id': item.kurzzeichen,
                  'title': item.kurzzeichen
                });
              }
            });
            angular.forEach(lodash.sortBy(unorderedProduzentenL, function(kl){
                return kl.id.toLowerCase();
            }), function(item){
                $scope.produzentenL.push(item);
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
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          count: 10,
          sorting: {
            name: 'desc'
          }
        }, {
          filterDelay: 400,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: ProdukteModel,
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      $scope.produktErstellen = function() {
        if(!$scope.editing) {
          if(angular.isUndefined($scope.entries)) {
            $scope.entries = [];
          }
          $scope.editing = true;
          var newProdukt = cloneObj(defaults.model);
          $scope.editingProdukt = newProdukt;
          $scope.editingProdukt.isNew = true;
          $scope.entries.push(newProdukt);
          $scope.tableParams.reload();
        }
      };

      $scope.cancel = function(produkt) {
        if(produkt.isNew) {
          var produktIndex = $scope.entries.indexOf(produkt);
          $scope.entries.splice(produktIndex, 1);
        }
        if($scope.originalProdukt) {
          var isProduktById = function (element) {
            return produkt.id === element.id;
          };
          var originalProduktIndex = $scope.entries.findIndex(isProduktById);
          if(originalProduktIndex >= 0) {
            $scope.entries[originalProduktIndex] = $scope.originalProdukt;
          }
          $scope.originalProdukt = undefined;
        }
        produkt.editable = false;
        $scope.editing = false;
        $scope.editingProdukt = undefined;
        $scope.tableParams.reload();
      };

      $scope.edit = function(produkt) {
        $scope.originalProdukt = cloneObj(produkt);
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

      var throttledReload = lodash.throttle(function() {
          $scope.tableParams.reload();
      }, 200);
      $scope.$watch('search.query',
        function(newVal, oldVal) {
          if(newVal !== oldVal) {
            throttledReload();
          }
        }
      );

    }
  ]);
