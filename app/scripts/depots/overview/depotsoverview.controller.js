'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('DepotsOverviewController', ['$scope', '$rootScope', '$filter',
    'DepotsOverviewModel', 'NgTableParams', 'OverviewCheckboxUtil',
    'ReportvorlagenService', '$location', 'lodash', 'EmailUtil', 'gettext',
    function($scope, $rootScope, $filter, DepotsOverviewModel, NgTableParams,
      OverviewCheckboxUtil, ReportvorlagenService, $location, _, EmailUtil, gettext) {
      $rootScope.viewId = 'L-Dep';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.showGenerateReport = false;

      $scope.search = {
        query: ''
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

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageDepotbrief');
      };

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
        $scope.updateChecked();
      }, true);

      $scope.updateChecked = function() {
        var activeCheckboxes = _.pickBy($scope.checkboxes.items, function(value, key) {
          return value;
        });
        $scope.depotIdsMailing = _($scope.filteredEntries)
          .keyBy('id')
          .at(Object.keys(activeCheckboxes))
          .map('id')
          .value();
      };

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Depot erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/depots/new');
        }
      }, {
        label: gettext('Depotbrief erstellen'),
        iconClass: 'fa fa-file',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveGenerateReport");
          $scope.showGenerateReport = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('E-Mail an Kunden versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          DepotsOverviewModel.personen({f: 'id=' + $scope.checkboxes.ids + ';'}, function(personen) {
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
          $scope.$broadcast("resetDirectiveEmailDialog");
          $scope.entity = gettext('Depots (alle betroffenen Personen)');
          $scope.url = 'mailing/sendEmailToDepotSubscribers';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{depot.name}} \n {{depot.kurzzeichen}}  \n {{depot.plz}}  \n {{depot.ort}}  \n {{depot.apTelefon}}');
          $scope.showCreateEMailDialog = true;
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy()) :
              dataSet;
            dataSet = $filter('filter')(dataSet, params.filter());

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }

      function search() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();
      }

      function load() {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;
        $scope.entries = DepotsOverviewModel.query({
          q: $scope.query
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      load();

      $scope.$watch('search.query', function() {
        search();
      }, true);

    }
  ]);
