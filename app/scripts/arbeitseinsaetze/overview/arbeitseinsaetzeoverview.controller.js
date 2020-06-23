'use strict';

/**
 */
angular
  .module('openolitor-admin')
  .controller('ArbeitseinsaetzeOverviewController', [
    '$q',
    '$scope',
    '$rootScope',
    '$filter',
    'ArbeitseinsaetzeModel',
    'NgTableParams',
    'localeSensitiveComparator',
    'OverviewCheckboxUtil',
    '$location',
    'ReportvorlagenService',
    'ArbeitskategorienService',
    'gettext',
    'gettextCatalog',
    'FilterQueryUtil',
    'moment',
    'EnumUtil',
    'ZEITRAUM',
    'lodash',
    function(
      $q,
      $scope,
      $rootScope,
      $filter,
      ArbeitseinsaetzeModel,
      NgTableParams,
      localeSensitiveComparator,
      OverviewCheckboxUtil,
      $location,
      ReportvorlagenService,
      ArbeitskategorienService,
      gettext,
      gettextCatalog,
      FilterQueryUtil,
      moment,
      EnumUtil,
      ZEITRAUM,
      lodash
    ) {
      $rootScope.viewId = 'L-Abein';

      $scope.zeitraumLAsArray = EnumUtil.asArray(ZEITRAUM);
      $scope.zeitraumL = []; 
      angular.forEach(lodash.sortBy($scope.zeitraumLAsArray, function(zr){ 
          return gettextCatalog.getString(zr.label).toLowerCase();
      }), function(value, key) {
        $scope.zeitraumL.push({
          'id': value.id,
          'title': gettextCatalog.getString(value.label)
        });
      });

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      //watch for set of Arbeitskategorien
      $scope.kategorienL = [];
      $scope.$watch(ArbeitskategorienService.getArbeitskategorien, function(
        list
      ) {
        if (list) {
          angular.forEach(list, function(item) {
            if (item.id) {
              $scope.kategorienL.push({
                id: item.beschreibung,
                title: item.beschreibung
              });
            }
          });
          $scope.tableParams.reload();
        }
      });

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: ''
      };

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      // watch for check all checkbox
      $scope.$watch(
        function() {
          return $scope.checkboxes.checked;
        },
        function(value) {
          OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
        }
      );

      // watch for data checkboxes
      $scope.$watch(
        function() {
          return $scope.checkboxes.items;
        },
        function() {
          OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
        },
        true
      );

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageArbeitseinsatz');
      };

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      $scope.sameDay = function(d1, d2) {
        return d1.toDateString() === d2.toDateString();
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams(
          {
            // jshint ignore:line
            page: 1,
            count: 10,
            sorting: {
              zeitVon: 'asc'
            },
            filter:{zeitVonF:'D'}
          },
          {
            filterDelay: 0,
            groupOptions: {
              isExpanded: true
            },
            exportODSModel: ArbeitseinsaetzeModel,
            getData: function(params) {
              if (!$scope.entries) {
                return;
              }
              var f = params.filter();
              var data = $scope.entries;
              if(f.zeitVonF && f.zeitVonF !== null) {
                var from, to;
                if(f.zeitVonF === 'D') {
                  from = moment().startOf('day').toDate();
                  to = new Date(8640000000000000);
                } else if(f.zeitVonF === 'd') {
                  from = moment().startOf('day').toDate();
                  to = moment().endOf('day').toDate();
                } else if(f.zeitVonF === 'w') {
                  from = moment().startOf('week').toDate();
                  to = moment().endOf('week').toDate();
                } else if(f.zeitVonF === 'M') {
                  from = moment().startOf('month').toDate();
                  to = moment().endOf('month').toDate();
                } else {
                  from =new Date(-8640000000000000);
                  to = new Date(8640000000000000);
                }
                data = $filter('dateRange') (
                    data,
                    from,
                    to,
                    'zeitVon'
                  );
              }
              // use build-in angular filter
              var filteredData = $filter('filter')(
                data,
                $scope.search.query
              );
              f = params.filter(true);
              delete f.zeitVonF;
              var orderedData = $filter('filter')(
                filteredData,
                f
              );
              orderedData = params.sorting ? $filter('orderBy')(
                    orderedData,
                    params.orderBy(),
                    false,
                    localeSensitiveComparator
                  )
                : orderedData;

              $scope.filteredEntries = filteredData;

              params.total(orderedData.length);
              return orderedData.slice(
                (params.page() - 1) * params.count(),
                params.page() * params.count()
              );
            }
          }
        );
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ArbeitseinsaetzeModel.query(
          {
            q: $scope.query
          },
          function() {
            $scope.tableParams.reload();
            $scope.loading = false;
          }
        );
      }

      search();

      $scope.$watch(
        'search.query',
        function() {
          $scope.search.filterQuery = FilterQueryUtil.transform(
            $scope.search.query
          );
          $scope.search.queryQuery = FilterQueryUtil.withoutFilters(
            $scope.search.query
          );
          search();
        },
        true
      );

      $scope.actions = [
        {
          label: gettext('Arbeitseinsätze-Brief'),
          noEntityText: true,
          iconClass: 'fa fa-file',
          onExecute: function() {
            $scope.showGenerateReport = true;
            return true;
          },
          isDisabled: function() {
            return !$scope.checkboxes.checkedAny;
          }
        }
      ];
    }
  ]);
