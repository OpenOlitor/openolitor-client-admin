'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ZusatzAbotypenOverviewController', ['$scope', '$filter',
    'ZusatzAbotypenOverviewModel', 'NgTableParams', 'lodash', 'EmailUtil', 'OverviewCheckboxUtil', '$location', 'FilterQueryUtil',
    function($scope, $filter, ZusatzAbotypenOverviewModel, NgTableParams, _, EmailUtil, OverviewCheckboxUtil, $location, FilterQueryUtil) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

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

      if (!$scope.zusatzAbosTableParams) {
        //use default zusatzAbosTableParams
        $scope.zusatzAbosTableParams= new NgTableParams({ // jshint ignore:line
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
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy()) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }
        });
      }

      $scope.actions = [{
        labelFunction: function() {
            return 'Zusatzabotyp erstellen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/zusatzAbotypen/new');
        }
      }, {
        label: 'Email an Kunden versenden',
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          ZusatzAbotypenOverviewModel.personen({
            f: 'id=' + $scope.checkboxes.ids + ';'
          }, function(personen) {
            var emailAddresses = _.map(personen, 'email');
            EmailUtil.toMailToBccLink(emailAddresses);
          });

          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.loading = true;
        $scope.entries = ZusatzAbotypenOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.zusatzAbosTableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      $scope.style = function(zusatzAbotyp) {
        if (zusatzAbotyp.farbCode) {
          return {
            'background-color': zusatzAbotyp.farbCode
          };
        }
      };

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }

      $scope.$watch('search.query', function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

    }
  ]);
