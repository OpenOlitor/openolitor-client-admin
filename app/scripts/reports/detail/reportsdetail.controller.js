'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportsDetailController', ['$scope', '$rootScope', '$filter', '$routeParams',
    '$location', '$uibModal', 'gettext', 'ReportsModel', '$log', 'NgTableParams', 'lodash',
    function($scope, $rootScope, $filter, $routeParams, $location, $uibModal, gettext, ReportsModel, $log, NgTableParams, lodash) {
      $rootScope.viewId = 'D-Rept';

      $scope.isModifying = false;

      $scope.result = {
        entries: []
      }
      $scope.cols = [];

      var defaults = {
        model: {
          id: undefined
        }
      };

      $scope.search = {
        query: ''
      };

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.isModifying = true;
        $scope.report = new ReportsModel(defaults.model);
      } else {
        ReportsModel.get({
          id: $routeParams.id
        }, function(result) {
          result.query = sqlFormatter.format(result.query);
          $scope.report = result;
        });
      }

      $scope.isExisting = function() {
        return angular.isDefined($scope.report) && angular.isDefined($scope.report.id);
      };

      $scope.renderedInput = function(key, value) {
        if (value !== null) {
          if (/kundeid|kunde_id|kunde-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/kunden/' + value + '">' + value + '</a>';
          } else if (/zusatz-abo-id|zusatz_abo_id|zusatzaboid|zusatzabo_id|zusatzabo-id/.test(key.toLowerCase())) {
            return value;
          } else if (/abotypid|abotyp_id|abotyp-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/abotypen/' + value + '">' + value + '</a>';
          } else if (/aboid|abo_id|abo-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/abos?q=id%3D' + value + '">' + value + '</a>';
          } else if (/tourid|tour_id|tour-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/touren/' + value + '">' + value + '</a>';
          } else if (/depotid|depot_id|depot-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/depots/' + value + '">' + value + '</a>';
          } else if (/produzentid|produzent_id|produzent-id/.test(key.toLowerCase())) {
            return '<a href="' + '#/produzenten/' + value + '">' + value + '</a>';
          } else {
            return value;
          }
        }
        return value;
      };

      $scope.renderedTitles = function(key) {
        if (key !== null) {
          if (/kundeid|kunde_id|kunde-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/kunden?q=id%3D' + uniqueItems + '&tf=%7B%22typen%22:%22%22%7D">' + key + '</a></b>';
          } else if (/zusatz-abo-id|zusatz_abo_id|zusatzaboid|zusatzabo_id|zusatzabo-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/zusatzabos?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else if (/aboid|abo_id|abo-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/abos?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else if (/personid|person_id|person-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/personen?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else if (/rechnungpositionid|rechnungposition_id|rechnungposition-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/rechnungspositionen?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else if (/einkaufsrechnungid|einkaufsrechnung_id|einkaufsrechnung-id|sammelbestellungid|sammelbestellung-id|sammelbestellung_id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/einkaufsrechnungen?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else if (/rechnung_id|rechnungId|rechnung-id/.test(key.toLowerCase())) {
            var items = lodash.map($scope.result.entries, key);
            var uniqueItems = lodash.reject(lodash.uniq(items), _.isEmpty);
            return '<b><a href="#/rechnungen?q=id%3D' + uniqueItems + '">' + key + '</a></b>';
          } else {
            return '<b>' + key + '</b>';
          }
        }
        return '<b>' + key + '</b>';
      };

      $scope.executeReport = function() {
        $scope.result = {};
        ReportsModel.executeReport({
          id: $scope.report.id,
          query: $scope.report.query
        }, function(data) {
          if (data && data[0]) {
            $scope.cols = [];
            for (var key in data[0]) {
              if (key.indexOf('$') !== 0 && key !== 'toJSON') {
                var a = data[0][key].replace(/[()]/g,'').split(',');
                $scope.cols.push({
                  field: a[0],
                  getValue: $scope.renderedInput(a[0],a[1])
                });
              }
            }
          }
          if (!$scope.result || !$scope.result.entries) {
            $scope.result.entries = lodash.map(data,function getvalues(a) {
              var r = '{';
              for (var b in a) {
                if (b.indexOf('$') !== 0 && b !=='toJSON'){
                  if (r !== '{'){
                    r = r + ',"' +  a[b].replace('(','')
                                        .replace(')','')
                                        .replace(',','":"')
                                        .replace('\n',' ') + '"';
                  } else{
                    r = r + '"' + a[b].replace('(','')
                                      .replace(')','')
                                      .replace(',','":"')
                                      .replace('/\n',' ') + '"';
                  }

                }
              }
              r = r + '}';
              return JSON.parse(r);
              }
            );

            $scope.tableParams.reload();
          }
        });
      };

      $scope.getValue = function(col, dataEntry) {
        return $scope.renderedInput(col,dataEntry[col]);

      }

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: ReportsModel,
          exportODSFilter: function() {
            return {
              id: $scope.report.id,
              query: $scope.report.query
            };
          },
          getData: function(params) {
            if (!$scope.result || !$scope.result.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.result.entries, $scope.search.query);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());

            params.total(dataSet.length);
            return dataSet.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }
        });
      }

      $scope.save = function() {
        return $scope.report.$save(function() {
          $scope.isModifying = false;
          $scope.reportForm.$setPristine();
        });
      };

      $scope.created = function(id) {
        $location.path('/reports/' + id);
      };

      $scope.backToList = function() {
        $location.path('/reports');
      };

      $scope.delete = function() {
        return $scope.report.$delete();
      };

      $scope.changeReport = function() {
        $scope.result.entries = [];
      };
    }
  ]);
