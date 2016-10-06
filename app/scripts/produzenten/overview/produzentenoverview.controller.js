'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProduzentenOverviewController', ['$q', '$scope', '$filter',
    'ProduzentenModel', 'NgTableParams', 'localeSensitiveComparator',
    'OverviewCheckboxUtil', '$location', 'VorlagenService',
    function($q, $scope, $filter, ProduzentenModel, NgTableParams, localeSensitiveComparator,
      OverviewCheckboxUtil, $location, VorlagenService) {

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.search = {
        query: ''
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

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            kurzzeichen: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: ProduzentenModel,
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
        //  $scope.entries = $scope.dummyEntries;
        $scope.tableParams.reload();

        $scope.loading = true;
        $scope.entries = ProduzentenModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      search();

      $scope.projektVorlagen = function() {
        return VorlagenService.getVorlagen('VorlageProduzentenbrief');
      };

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.actions = [{
        labelFunction: function() {
          return 'Produzent erstellen';
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/produzenten/new');
        }
      }, {
        label: 'Produzentenbrief',
        noEntityText: true,
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

    }
  ]);
