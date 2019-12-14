'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('PersonenOverviewController', ['$q', '$scope', '$rootScope', '$filter', '$location',
    'KundenOverviewModel', 'PersonenOverviewModel', 'NgTableParams', 'PersonCategoriesService', 'KundentypenService', 'OverviewCheckboxUtil', 'ReportvorlagenService', 'localeSensitiveComparator', 'FilterQueryUtil', 'EmailUtil', 'lodash', 'gettext', 'DetailNavigationService',
    function($q, $scope, $rootScope, $filter, $location, KundenOverviewModel, PersonenOverviewModel, NgTableParams, PersonCategoriesService,
      KundentypenService, OverviewCheckboxUtil, ReportvorlagenService, localeSensitiveComparator, FilterQueryUtil, EmailUtil, lodash, gettext, DetailNavigationService) {
      $rootScope.viewId = 'L-Per';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.model = {};

      $scope.kundentypen = [];
      $scope.personCategories = [];
      $scope.$watch(KundentypenService.getKundentypen,


        function(list) {
          var unorderedKundenTyp = [];
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom personentyp, use only id
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

      $scope.$watch(PersonCategoriesService.getPersonCategories,
        function(list) {
          var unorderedPersonCategory = [];
          if (list) {
            angular.forEach(list, function(item) {
              //check if system or custom personentyp, use only id
              var personCategory = (item.personCategory) ? item.personCategory:
                item;
              unorderedPersonCategory.push({
                'id': personCategory.name,
                'title': personCategory.name
              });
            });
            angular.forEach(lodash.sortBy(unorderedPersonCategory, function(pc){
                return pc.id.toLowerCase();
            }), function(item){
                $scope.personCategories.push(item);
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
        return ReportvorlagenService.getVorlagen('VorlagePersonenbrief');
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

      $scope.closeBerichtFunct= function() {
        return $scope.closeBericht;
      };

      $scope.closeCreateEMailDialog = function() {
        $scope.showCreateEMailDialog = false;
      };

      $scope.closeCreateEMailDialogFunct = function() {
        return $scope.closeCreateEMailDialog;
      };

      $scope.actions = [{
        label: gettext('E-Mail versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          var emailAddresses = _($scope.filteredEntries)
            .keyBy('id')
            .at(Object.keys($scope.checkboxes.items))
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
          $scope.entity = gettext('person');
          $scope.url = 'mailing/sendEmailToPersonen';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}}');
          $scope.personIdsMailing = _($scope.filteredEntries)
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
      },{
        label: gettext('Aboliste anzeigen'),
        iconClass: 'fa fa-user',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          result = lodash.map(result, 'kundeId');
          $location.path('/abos').search('q', 'kundeId=' + result.join()).search('tf','{"abotypId":""}');
        }
        }
      ];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            name: 'asc'
          },
          filter: {
            kundentypen: '',
            personentypen: ''
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
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
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
