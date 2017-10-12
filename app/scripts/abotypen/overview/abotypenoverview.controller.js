'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AbotypenOverviewController', ['$scope', '$filter',
    'AbotypenOverviewModel', 'NgTableParams', 'lodash', 'EmailUtil', 'OverviewCheckboxUtil', '$location', 'FilterQueryUtil','gettext',
    function($scope, $filter, AbotypenOverviewModel, NgTableParams, _, EmailUtil, OverviewCheckboxUtil, $location, FilterQueryUtil, gettext) {

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.selectedAbotyp = undefined;
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

      if (!$scope.abosTableParams) {
        //use default abostableParams
        $scope.abosTableParams = new NgTableParams({ // jshint ignore:line
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
        console.log($scope)
      }

      $scope.selectAbotyp = function(abotyp, itemId) {
        var allRows = angular.element('#abotypesTable table tbody tr');
        allRows.removeClass('row-selected');
        if ($scope.selectedAbotyp === abotyp) {
          $scope.selectedAbotyp = undefined;
        } else {
          $scope.selectedAbotyp = abotyp;
          var row = angular.element('#' + itemId);
          row.addClass('row-selected');
        }
      };

      $scope.unselectAbotyp = function() {
        $scope.selectedAbotyp = undefined;
        var allRows = angular.element('#abotypesTable table tbody tr');
        allRows.removeClass('row-selected');
      }

      $scope.unselectAbotypFunct = function() {
          return $scope.unselectAbotyp;
      }

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Abotyp erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/abotypen/new');
        }
      }, {
        label: gettext('E-Mail an Kunden versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          AbotypenOverviewModel.personen({
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
      }, {
        label: gettext('E-Mail Formular'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          $scope.url = 'mailing/sendEmailToAbotypSubscribers';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{abotyp.name}} \n {{abotyp.beschreibung}}  \n {{abotyp.preis}}  \n {{abotyp.preiseinheit}}  \n {{abotyp.laufzeiteinheit}}');  
          $scope.abotypIdsMailing = _($scope.filteredEntries)
            .keyBy('id')
            .at($scope.checkboxes.ids)
            .map('id')
            .value();
          $scope.showCreateEMailDialog = true;
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
        $scope.entries = AbotypenOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.abosTableParams.reload();
          $scope.loading = false;
          $location.search('q', $scope.search.query);
        });
      }

      $scope.closeCreateEMailDialog = function() {
        return $scope.showCreateEMailDialog = false;
      };

      $scope.closeCreateEMailDialogFunct = function() {
        return $scope.closeCreateEMailDialog ;
      };

      $scope.style = function(abotyp) {
        if (abotyp.farbCode) {
          return {
            'background-color': abotyp.farbCode
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
