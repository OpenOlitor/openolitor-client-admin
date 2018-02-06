'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('PersonenOverviewController', ['$q', '$scope', '$filter', '$location',
    'KundenOverviewModel', 'PersonenOverviewModel', 'NgTableParams', 'PersonCategoriesService', 'KundentypenService', 'OverviewCheckboxUtil', 'VorlagenService', 'localeSensitiveComparator', 'FilterQueryUtil', 'EmailUtil', 'lodash', 'gettext', 'DetailNavigationService',
    function($q, $scope, $filter, $location, KundenOverviewModel, PersonenOverviewModel, NgTableParams, PersonCategoriesService,
      KundentypenService, OverviewCheckboxUtil, VorlagenService, localeSensitiveComparator, FilterQueryUtil, EmailUtil, _, gettext, DetailNavigationService) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.kundentypen = [];
      $scope.personCategories = [];
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

      $scope.$watch(PersonCategoriesService.getPersonCategories,
        function(list) {
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom personentyp, use only id
              var personCategory = (item.personCategory) ? item.personCategory:
                item;
                console.log(id)
              $scope.personCategories.push({
                'id': personCategory.name,
                'title': personCategory.name
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

      $scope.navigateToKunde = function(id) {
          $scope.filteredEntries = [];
          var listKundeIds = []
          var currentKundeId = $filter('filter')($scope.entries,{kundeId:id},true)[0];

          angular.forEach($scope.checkboxes.ids, function(id){
              listKundeIds.push($scope.checkboxes.data[id].kundeId);
          });

          var allEntries = KundenOverviewModel.query({
              f: $scope.search.filterQuery
          }, function() {
              angular.forEach(listKundeIds, function(kundeId){
                  $scope.filteredEntries.push($filter('filter')(allEntries,{id:kundeId},true)[0]);
              });
              DetailNavigationService.detailFromOverview(currentKundeId.kundeId, $scope, 'kunden', $location.url());
          });
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
        label: gettext('Email versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          var emailAddresses = _($scope.filteredEntries)
            .keyBy('id')
            .at($scope.checkboxes.ids)
            .map('email')
            .value();

          EmailUtil.toMailToBccLink(emailAddresses);
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
          exportODSFilter: function() {
            return {
              f: $scope.search.filterQuery
            };
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }

            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter(true));
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), false, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);

            $location.search({'q': $scope.search.query, 'tf': JSON.stringify($scope.tableParams.filter())});

            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });

        var existingFilter = $location.search().tf;
        if (existingFilter) {
          $scope.tableParams.filter(JSON.parse(existingFilter));
        }
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
