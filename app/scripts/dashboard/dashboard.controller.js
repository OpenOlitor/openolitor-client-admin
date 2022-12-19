'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('DashboardController', ['$q', '$scope', '$rootScope', '$filter',
    'PendenzenOverviewModel', 'PendenzenService', 'LieferplanungModel', 'RechnungenOverviewModel', 'NgTableParams', 'PENDENZSTATUS', 'RECHNUNGSTATUS', 'EnumUtil', 'localeSensitiveComparator', 'gettextCatalog',
    function($q, $scope, $rootScope, $filter, PendenzenOverviewModel, PendenzenService, LieferplanungModel, RechnungenOverviewModel,
      NgTableParams, PENDENZSTATUS, RECHNUNGSTATUS, EnumUtil, localeSensitiveComparator, gettextCatalog) {

      $rootScope.viewId = 'S-Dshb';

      $scope.rechnungStati = EnumUtil.asArray(RECHNUNGSTATUS);

      $scope.pendenzenEntries = [];
      $scope.lieferplanungEntries = [];
      $scope.rechnungenEntries = [];
      $scope.pendenzenLoading = false;
      $scope.lieferplanungLoading = false;
      $scope.rechnungenLoading = false;

      $scope.pendenzen = {};
      $scope.pendenzen.search = {
        query: ''
      };

      $scope.statusL = [];
      angular.forEach(PENDENZSTATUS, function(value, key) {
        $scope.statusL.push({
          'id': key,
          'title': gettextCatalog.getString(value)
        });
      });

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.renderBemerkungText = function(text) {
        return PendenzenService.renderText(text);
      };

      if (!$scope.pendenzenTableParams) {
        //use default tableParams
        $scope.pendenzenTableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 5,
          sorting: {
            datum: 'asc'
          },
          filter: { }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.pendenzenEntries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.pendenzenEntries, $scope.pendenzen.search.query);

            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) : dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }

      function pendenzenSearch() {
        if ($scope.pendenzenLoading) {
          return;
        }
        $scope.pendenzenTableParams.reload();

        var query = 'status=Ausstehend';
        $scope.pendenzenLoading = true;
        $scope.pendenzenEntries = PendenzenOverviewModel.query({
          q: query
        }, function() {
          $scope.pendenzenTableParams.reload();
          $scope.pendenzenLoading = false;
        });
      }

      pendenzenSearch();

      $scope.markErledigt = function(pendenz) {
        pendenz.status = PENDENZSTATUS.ERLEDIGT;
        new PendenzenOverviewModel(pendenz).$save();
      };

      $scope.$watch('pendenzen.search.query', function() {
        pendenzenSearch();
      }, true);

      $scope.isUnresolved = function(pendenz) {
        return !angular.isUndefined(pendenz.status) && pendenz.status === PENDENZSTATUS.AUSSTEHEND;
      };

      if (!$scope.lieferplanungenTableParams) {
        //use default tableParams
        $scope.lieferplanungenTableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 5,
          sorting: {
            nr: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.lieferplanungEntries) {
              return;
            }
            // also filter by ngtable filters
            var dataSet = $filter('filter')($scope.lieferplanungEntries, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) :
              dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }

      function lieferplanungSearch() {
        if ($scope.lieferplanungLoading) {
          return;
        }

        $scope.lieferplanungLoading = true;
        var query = '';
        $scope.lieferplanungEntries = LieferplanungModel.query({
           q: query
        }, function() {
          $scope.lieferplanungenTableParams.reload();
          $scope.lieferplanungLoading = false;
        });
      }

      lieferplanungSearch();

      if (!$scope.rechnungenTableParams) {
        //use default tableParams
        $scope.rechnungenTableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 5,
          sorting: {
            name: 'asc'
          },
          filter: {
            status: 'Verschickt'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.rechnungEntries) {
              return;
            }
            // also filter by ngtable filters
            var dataSet = $filter('filter')($scope.rechnungEntries, params.filter());
            dataSet = $filter('filter')(dataSet, $scope.todayOrEarlier('faelligkeitsDatum'));
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), true, localeSensitiveComparator) : dataSet;

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) *
              params.count(), params.page() * params.count());
          }

        });
      }

      function rechnungenSearch() {
        if ($scope.rechnungenLoading) {
          return;
        }
        $scope.rechnungenTableParams.reload();

        $scope.rechnungenLoading = true;
        var query = 'Status=Verschickt';
        $scope.rechnungEntries = RechnungenOverviewModel.query({
          f: query
        }, function() {
          $scope.rechnungenTableParams.reload();
          $scope.rechnungenLoading = false;
        });
      }

      rechnungenSearch();

      $scope.todayOrEarlier = function(prop){
        return function(item){
          return item[prop] <= new Date();
        };
      };

    }
  ]);
