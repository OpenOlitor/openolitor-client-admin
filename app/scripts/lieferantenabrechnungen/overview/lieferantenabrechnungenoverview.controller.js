'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('LieferantenAbrechnungenOverviewController', ['$scope', '$filter',
    '$location',
    'LieferantenAbrechnungenOverviewModel', 'ProduzentenModel',
    'NgTableParams',
    'FilterQueryUtil', 'OverviewCheckboxUtil', 'BESTELLSTATUS', 'EnumUtil',
    'msgBus', 'lodash',
    function($scope, $filter, $location, LieferantenAbrechnungenOverviewModel,
      ProduzentenModel, NgTableParams, FilterQueryUtil, OverviewCheckboxUtil,
      BESTELLSTATUS, EnumUtil, msgBus, lodash) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.bestellstatusL = EnumUtil.asArray(BESTELLSTATUS);

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: ''
      };

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.produzentL = [];
      ProduzentenModel.query({
        q: ''
      }, function(list) {
        angular.forEach(list, function(produzent) {
          $scope.produzentL.push({
            'id': produzent.id,
            'title': produzent.kurzzeichen
          });
        });
      });

      $scope.selectBestellung = function(bestellung) {
        if ($scope.selectedBestellung === bestellung) {
          $scope.selectedBestellung = undefined;
        } else {
          $scope.selectedBestellung = bestellung;
        }
        $scope.showCreateAbrechnungDialog = false;
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
        $scope.checkSelectedAbgeschlosseneBestellungen();
      }, true);

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            id: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries, $scope
              .search.queryQuery);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy()) :
              orderedData;

            $scope.filteredEntries = filteredData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }


      $scope.checkSelectedAbgeschlosseneBestellungen = function() {
        var length = $scope.checkboxes.ids.length;
        var result = [];
        for (var i = 0; i < length; ++i) {
          var id = $scope.checkboxes.ids[i];
          if ($scope.checkboxes.data[id].status === BESTELLSTATUS.ABGESCHLOSSEN) {
            result.push(id);
          }
        }
        $scope.checkboxes.selectedAbgeschlosseneBestellungen = result;
      };

      $scope.actions = [{
        labelFunction: function() {
          return 'abrechnen';
        },
        iconClass: 'fa fa-calculator',
        onExecute: function() {
          $scope.selectedBestellung = undefined;
          $scope.showCreateAbrechnungDialog = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny || $scope.checkboxes.selectedAbgeschlosseneBestellungen
            .length === 0;
        }
      }];


      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.loading = true;
        $scope.entries = LieferantenAbrechnungenOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.closeAbrechnungDialog = function() {
        $scope.showCreateAbrechnungDialog = false;
      };

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'Bestellung') {
          $scope.entries.map(function(entry) {
            if (entry.id === msg.data.id) {
              angular.copy(msg.data, entry);
            }
          });
          $scope.$apply();
        }
      });
    }
  ]);
