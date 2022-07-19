'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('LieferplanungOverviewController', ['$q', '$scope', '$rootScope', '$filter',
    'LieferplanungModel', 'NgTableParams',
    'FilterQueryUtil', 'OverviewCheckboxUtil',
    'msgBus', '$location', 'localeSensitiveComparator', 'gettext', 'ReportvorlagenService',
    function($q, $scope, $rootScope, $filter, LieferplanungModel, NgTableParams,
      FilterQueryUtil, OverviewCheckboxUtil,
      msgBus, $location, localeSensitiveComparator, gettext, ReportvorlagenService) {
      $rootScope.viewId = 'L-Pla';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.initGJ = false;

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
      }, true);

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageLieferplanung');
      };

      $scope.selectGeschaeftsjahr = function(gj) {
        if(angular.isDefined(gj)) {
          $scope.geschaeftsjahr = gj;
        } else {
          $scope.geschaeftsjahr = undefined;
        }
        $scope.initGJ = true;
        search();
        return false;
      }

      $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.tableParams.reload();
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            nr: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: LieferplanungModel,
          exportODSFilter: function() {
            return {
              f: $scope.search.filterQuery,
              g: $scope.geschaeftsjahr
            };
          },
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
            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }

      $scope.actions = [{
          labelFunction: function() {
            return gettext('Neue Lieferplanung generieren');
          },
          iconClass: 'glyphicon glyphicon-plus',
          onExecute: function() {
            return $scope.createNewLieferplanung();
          }
        },
        {
          label: gettext('Lieferplanungsbericht'),
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
        }
      ];

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      function search() {
        if ($scope.loading || !$scope.initGJ) {
          return;
        }

        $scope.loading = true;
        $scope.entries = LieferplanungModel.query({
          f: $scope.search.filterQuery,
          g: $scope.geschaeftsjahr,
          q: $scope.search.queryQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
          $location.search('g', $scope.geschaeftsjahr);
        });
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }
      var existingGJ = $location.search().g;
      if (existingGJ) {
        $scope.geschaeftsjahr = existingGJ;
      }

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      $scope.createNewLieferplanung = function() {
        $scope.newLieferplanung = new LieferplanungModel({
          bemerkungen: '',
          status: 'Offen'
        });
        $scope.loading = true;
        return $scope.newLieferplanung.$save();
      };

      msgBus.onMsg('DataEvent', $scope, function(event, msg) {
        if (msg.entity === 'LieferplanungCreated') {
          $location.url('/lieferplanung/' + msg.data.id);
          $scope.loading = false;
          $scope.$apply();
        }
      });
    }
  ]);
