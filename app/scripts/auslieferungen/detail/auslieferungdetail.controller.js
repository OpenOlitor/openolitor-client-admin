'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AuslieferungDetailController', ['$q', '$scope', '$filter',
    '$route', '$routeParams',
    'DepotAuslieferungenModel', 'TourAuslieferungenModel',
    'PostAuslieferungenModel', 'KundenOverviewModel', 'DetailNavigationService', 'NgTableParams', 'AUSLIEFERUNGSTATUS', 'msgBus', 'DataUtil',
    'VorlagenService', 'localeSensitiveComparator', 'gettext','$location', 
    function($q, $scope, $filter, $route, $routeParams, DepotAuslieferungenModel,
      TourAuslieferungenModel, PostAuslieferungenModel, KundenOverviewModel, DetailNavigationService, NgTableParams,
      AUSLIEFERUNGSTATUS, msgBus, DataUtil, VorlagenService, localeSensitiveComparator, gettext, $location) {

      $scope.loading = false;
      $scope.model = {};
      $scope.selectedAbo = undefined;
      $scope.search = {
        query: ''
      };

      $scope.modelType = $route.current.$$route.model;
      var detailModel;

      switch ($scope.modelType) {
        case 'Depot':
          detailModel = DepotAuslieferungenModel;
          break;
        case 'Tour':
          detailModel = TourAuslieferungenModel;
          break;
        case 'Post':
          detailModel = PostAuslieferungenModel;
          break;
      }

      $scope.navigateToKunde = function(id) {
          $scope.filteredEntries = [];
          var listKundeIds = []
          var currentKorb = $filter('filter')($scope.tableParams.data,{id:id},true)[0];

          angular.forEach($scope.model.koerbe, function(korbe){
              listKundeIds.push(korbe.kunde.id);
          });
          var allEntries = KundenOverviewModel.query({
          }, function() {
              angular.forEach(listKundeIds, function(kundeId){
                  $scope.filteredEntries.push($filter('filter')(allEntries,{id:kundeId},true)[0]);
              });
              DetailNavigationService.detailFromOverview(currentKorb.kunde.id, $scope, 'kunden',  $location.url() );
          });
      };

      $scope.projektVorlagen = function() {
        return VorlagenService.getVorlagen('Vorlage'+$scope.modelType+$scope.vorlageTyp);
      };

      $scope.statusL = [];
      angular.forEach(AUSLIEFERUNGSTATUS, function(value, key) {
        $scope.statusL.push({
          'id': key,
          'title': value
        });
      });

      $scope.actions = [{
        label: gettext('speichern'),
        iconClass: 'fa fa-disc',
        onExecute: function() {
          return $scope.model.$save();
        },
        isDisabled: function() {
          return detailModel !== TourAuslieferungenModel;
        }
      }, {
        label: gettext('Lieferschein drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'lieferschein';
          $scope.vorlageTyp = 'Lieferschein';
          $scope.showGenerateReport = true;
          return true;
        }
      }, {
        label: gettext('Lieferetiketten drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'lieferetiketten';
          $scope.vorlageTyp = 'Lieferetikette';
          $scope.showGenerateReport = true;
          return true;
        }
      }, {
        label: gettext('Korbübersicht drucken'),
        iconClass: 'fa fa-print',
        onExecute: function() {
          $scope.reportType = 'korbuebersicht';
          $scope.vorlageTyp = 'Korbuebersicht';
          $scope.showGenerateReport = true;
          return true;
        }
      }, {
        label: gettext('als ausgeliefert markieren'),
        iconClass: 'fa fa-bicycle',
        onExecute: function() {
          return detailModel.ausliefern({id: $routeParams.id});
        }
      }];

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 50,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.model || !$scope.model.koerbe) {
              return;
            }
            // use build-in angular filter
            var filteredData = $filter('filter')($scope.model.koerbe,
              $scope
              .search.query);
            var orderedData = $filter('filter')(filteredData, params.filter());
            orderedData = params.sorting ?
              $filter('orderBy')(orderedData, params.orderBy(), false, localeSensitiveComparator) :
              orderedData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });
      }

      $scope.style = function(abotyp) {
        if (abotyp.farbCode) {
          return {
            'background-color': abotyp.farbCode
          };
        }
      };

      function load() {
        if ($scope.loading) {
          return;
        }
        $scope.tableParams.reload();

        $scope.loading = true;
        detailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.model = result;
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      load();

      $scope.closeBericht = function() {
        $scope.showGenerateReport = false;
      };

      $scope.closeBerichtFunct = function() {
        return $scope.closeBericht;
      };

      $scope.selectAbo = function(abo, itemId) {
        var allRows = angular.element('#korbTable table tbody tr');
        allRows.removeClass('row-selected');

        if ($scope.selectedAbo === abo) {
          $scope.selectedAbo = undefined;
        }
        else {
          $scope.selectedAbo = abo;
          var row = angular.element('#' + itemId);
          row.addClass('row-selected');
        }
      };

      $scope.unselectAbo = function() {
        $scope.selectedAbo = undefined;
        var allRows = angular.element('#korbTable table tbody tr');
        allRows.removeClass('row-selected');
      };

      $scope.unselectAboFunct = function() {
        return $scope.unselectAbo;
      };

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity.indexOf('Auslieferung') >= 0 && $scope.model.id === msg.data.id) {
          DataUtil.update(msg.data, $scope.model);
          $scope.$apply();
        }
      });
    }
  ]);
