'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('KundenOverviewController', ['$q', '$scope', '$rootScope', '$filter', '$location',
    'KundenOverviewModel', 'NgTableParams', 'KundentypenService', 'OverviewCheckboxUtil', 'ReportvorlagenService', 'localeSensitiveComparator', 'EmailUtil', 'lodash', 'FilterQueryUtil', 'gettext', 'DetailNavigationService',
    function($q, $scope, $rootScope, $filter, $location, KundenOverviewModel, NgTableParams,
      KundentypenService, OverviewCheckboxUtil, ReportvorlagenService, localeSensitiveComparator, EmailUtil, lodash, FilterQueryUtil, gettext, DetailNavigationService) {
      $rootScope.viewId = 'L-Kun';

      $scope.showCreateEMailDialog = false;
      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.kundentypen = [];
      $scope.$watch(KundentypenService.getKundentypen,
        function(list) {
          var unorderedKundenTyp = [];
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom kundentyp, use only id
              var id = (item.kundentyp) ? item.kundentyp :
                item;
              unorderedKundenTyp.push({
                'id': id,
                'title': id
              });
            });
            angular.forEach(lodash.sortBy(unorderedKundenTyp, function(kt){
                return kt.id.toLowerCase();
            }), function(item){
                $scope.kundentypen.push(item);
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

      $scope.navigateToDetail = function(id) {
        DetailNavigationService.detailFromOverview(id, $scope, 'kunden', $location.url());
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      $scope.projektVorlagen = function() {
        return ReportvorlagenService.getVorlagen('VorlageKundenbrief');
      };

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      $scope.closeCreateEMailDialog = function() {
        $scope.showCreateEMailDialog = false;
      };

      $scope.closeCreateEMailDialogFunct = function() {
        return $scope.closeCreateEMailDialog;
      };

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Kunde erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          return $location.path('/kunden/new');
        }
      }, {
        label: gettext('Kundenbrief'),
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
      }, {
        label: gettext('E-Mail versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          var emailAddresses = lodash($scope.filteredEntries)
            .keyBy('id')
            .at(Object.keys($scope.checkboxes.items))
            .flatMap('ansprechpersonen')
            .map('email')
            .value();

          EmailUtil.toMailToBccLink(emailAddresses);
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('E-Mail Formular'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-pencil',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveEmailDialog");
          $scope.entity = gettext('kunde');
          $scope.url = 'mailing/sendEmailToKunden';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{kunde.bezeichnung}} \n {{kunde.strasse}}  \n {{kunde.hausNummer}}  \n {{kunde.plz}}  \n {{kunde.ort}}');
          $scope.kundeIdsMailing = lodash($scope.filteredEntries)
            .keyBy('id')
            .at(Object.keys($scope.checkboxes.items))
            .map('id')
            .value();
          $scope.showCreateEMailDialog = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('Aboliste anzeigen'),
        iconClass: 'fa fa-user',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          result = lodash.map(result, 'id');
          //overwritting the tf parameter with an empty abotypId filter to avoid the heritage of the current typen filter
          $location.path('/abos').search('q', 'kundeId=' + result.join()).search('tf', '{"abotypId":""}');
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            bezeichnung: 'asc'
          },
          filter: {
            typen: ''
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: KundenOverviewModel,
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter(true));
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), false, localeSensitiveComparator) :
              dataSet;

            $scope.filteredEntries = dataSet;

            params.total(dataSet.length);

            $location.search({
              'q': $scope.search.query,
              'tf': JSON.stringify($scope.tableParams.filter())
            });

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
        $scope.entries = KundenOverviewModel.query({
          f: $scope.search.filterQuery
        }, function() {
          $scope.tableParams.reload();
          $scope.loading = false;
        });

      }

      $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.tableParams.reload();
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
