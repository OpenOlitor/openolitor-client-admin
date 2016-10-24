'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('PersonenOverviewController', ['$q', '$scope', '$filter', '$location',
    'PersonenOverviewModel', 'NgTableParams', 'KundentypenService', 'OverviewCheckboxUtil', 'VorlagenService', 'localeSensitiveComparator', 'FilterQueryUtil', 'EmailUtil', 'lodash',
    function($q, $scope, $filter, $location, PersonenOverviewModel, NgTableParams,
      KundentypenService, OverviewCheckboxUtil, VorlagenService, localeSensitiveComparator, FilterQueryUtil, EmailUtil, _) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.kundentypen = [];
      $scope.$watch(KundentypenService.getKundentypen,
        function(list) {
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom personentyp, use only id
              var id = (item.kundentyp) ? item.kundentyp :
                item;
              $scope.kundentypen.push({
                'id': id,
                'title': id
              });
            });
            $scope.tableParams.reload();
          }
        });

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: ''
      };

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
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      $scope.projektVorlagen = function() {
        return VorlagenService.getVorlagen('VorlagePersonenbrief');
      };

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function(value) {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope, value);
      }, true);

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.actions = [{
        label: 'Email versenden',
        noEntityText: true,
        iconClass: 'fa fa-file',
        onExecute: function() {
          EmailUtil.toMailToLink($scope.filteredEntries, $scope.checkboxes.ids);
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          },
          filter: {
            kundentypen: ''
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: PersonenOverviewModel,
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.entries,
              $scope.search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy(), false, localeSensitiveComparator) :
              orderedData;

            $scope.filteredEntries = filteredData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = PersonenOverviewModel.query({
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

      $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.tableParams.reload();
      };

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

    }
  ]);
