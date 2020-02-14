'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('EinkaufsrechnungenOverviewController', ['$scope', '$rootScope', '$filter',
    '$location', 'EinkaufsrechnungenOverviewModel', 'ProduzentenModel',
    'NgTableParams',
    'FilterQueryUtil', 'OverviewCheckboxUtil', 'BESTELLSTATUS', 'EnumUtil',
    'msgBus', 'lodash', 'localeSensitiveComparator', 'ReportvorlagenService', 'gettext',
    function($scope, $rootScope, $filter, $location, EinkaufsrechnungenOverviewModel,
      ProduzentenModel, NgTableParams, FilterQueryUtil, OverviewCheckboxUtil,
      BESTELLSTATUS, EnumUtil, msgBus, lodash, localeSensitiveComparator,
      ReportvorlagenService, gettext) {
      $rootScope.viewId = 'L-Eink';
      
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
        angular.forEach(lodash.sortBy(list, function(pl){
            return pl.kurzzeichen.toLowerCase();
        }), function(produzent) {
          $scope.produzentL.push({
            'id': produzent.id,
            'title': produzent.kurzzeichen
          });
        });
      });

      $scope.selectBestellung = function(bestellung, itemId) {
        var allRows = angular.element('#abrechnungenTable table tbody tr');
        allRows.removeClass('row-selected');
        if ($scope.selectedBestellung === bestellung) {
          $scope.selectedBestellung = undefined;
        } else {
          $scope.selectedBestellung = bestellung;
          var row = angular.element('#' + itemId);
          row.addClass('row-selected');
        }
        $scope.showCreateAbrechnungDialog = false;
      };

      $scope.unselectBestellung = function() {
        $scope.selectedAbo = undefined;
        var allRows = angular.element('#abrechnungenTable table tbody tr');
        allRows.removeClass('row-selected');
      };

      $scope.unselectBestellungFunct = function() {
        return $scope.selectedBestellung;
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
          exportODSModel: EinkaufsrechnungenOverviewModel,
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);

            $location.search({'q': $scope.search.query, 'tf': JSON.stringify($scope.tableParams.filter())});

            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });

        var existingFilter = $location.search().tf;
        if (existingFilter) {
          $scope.tableParams.filter(JSON.parse(existingFilter));
        }
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
          return gettext('abrechnen');
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
      },
      {
        label: gettext('Lieferantenbericht'),
        noEntityText: true,
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.loading = true;
        $scope.entries = EinkaufsrechnungenOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.closeAbrechnungDialog = function() {
        $scope.showCreateAbrechnungDialog = false;
      };

      $scope.closeAbrechnungDialogFunct = function() {
        return $scope.closeAbrechnungDialog;
      };

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageProduzentenabrechnung');
      };

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'Sammelbestellung') {
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
