'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProdukteOverviewController', ['$q', '$scope', '$filter',
    'ProdukteModel', 'ProdukteService', 'ngTableParams', 'EnumUtil', 'LIEFEREINHEIT', 'MONATE',
    function($q, $scope, $filter, ProdukteModel, ProdukteService, ngTableParams, EnumUtil, LIEFEREINHEIT, MONATE) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.editing = false;

      $scope.search = {
        query: ''
      };

      $scope.monate = EnumUtil.asArray(MONATE);
      $scope.liefereinheiten = EnumUtil.asArray(LIEFEREINHEIT);

      var defaults = {
        model: {
          id: undefined,
          name: '',
          verfuegbarVon: $scope.monate[0].id,
          verfuegbarBis: $scope.monate[11].id,
          kategorien: [],
          produzenten: [],
          einheit: LIEFEREINHEIT.KILOGRAMM,
          preis: 0.00,
          editable: true
        }
      };

      //watch for set of kundentypen
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

      function search() {
        if ($scope.loading) {
          return;
        }

        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ProdukteModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      //search();

      function clone(obj) {
        if (null === obj || 'object' !== typeof obj) {
          return obj;
        }
        var copy = obj.constructor();
        for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) {
            copy[attr] = clone(obj[attr]);
          }
        }
        return copy;
      }

      $scope.produktErstellen = function() {
        if(angular.isUndefined($scope.entries)) {
          $scope.entries = [];
        }
        $scope.editing = true;
        $scope.entries.push(clone(defaults.model));
        $scope.tableParams.reload();
      };

      $scope.edit = function(produkt) {
        produkt.editable = true;
        $scope.editing = true;
      };

      $scope.save = function(produkt) {
        produkt.editable = false;
        $scope.editing = false;
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

    }
  ]);
