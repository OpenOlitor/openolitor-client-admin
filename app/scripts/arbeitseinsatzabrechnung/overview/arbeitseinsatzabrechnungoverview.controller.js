'use strict';

/**
 */
angular
  .module('openolitor-admin')
  .controller('ArbeitseinsatzabrechnungOverviewController', [
    '$q',
    '$scope',
    '$rootScope',
    '$filter',
    'ArbeitseinsatzabrechnungModel',
    'NgTableParams',
    'localeSensitiveComparator',
    'OverviewCheckboxUtil',
    '$location',
    'ReportvorlagenService',
    'ArbeitskategorienService',
    'gettext',
    'FilterQueryUtil',
    function(
      $q,
      $scope,
      $rootScope,
      $filter,
      ArbeitseinsatzabrechnungModel,
      NgTableParams,
      localeSensitiveComparator,
      OverviewCheckboxUtil,
      $location,
      ReportvorlagenService,
      ArbeitskategorienService,
      gettext,
      FilterQueryUtil
    ) {
      $rootScope.viewId = 'L-EiAb';

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};
      //gettext has troubles with the ampersand and the translate label on the html. Workaround
      $scope.getPageTitle = 'Arbeitseinsätze & Abos';

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
        filterQuery: '',
        complexFlags: {
          kundeAktiv: true 
        }
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
        return ReportvorlagenService.getVorlagen('VorlageKundenbrief');
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
              kurzzeichen: 'asc'
            }
          },
          {
            filterDelay: 0,
            groupOptions: {
              isExpanded: true
            },
            exportODSModel: ArbeitseinsatzabrechnungModel,
            getData: function(params) {
              if (!$scope.entries) {
                return;
              }
              // use build-in angular filter
              var filteredData = $filter('filter')(
                $scope.entries,
                $scope.search.query
              );
              var orderedData = $filter('filter')(
                filteredData,
                params.filter()
              );
              orderedData = params.sorting
                ? $filter('orderBy')(
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
        $scope.entries = ArbeitseinsatzabrechnungModel.query({
            q: $scope.search.query,
            x: $scope.search.complexFlags
          },
          function() {
            $scope.tableParams.reload();
            $scope.loading = false;
          }
        );
      }

      search();

      $scope.$watchGroup(['search.query', 'search.complexFlags.kundeAktiv'],
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
          label: gettext('Arbeitseinsatzabrechnung-Brief'),
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
