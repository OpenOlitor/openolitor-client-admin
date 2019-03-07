'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('TourenDetailController', ['$scope', '$rootScope', '$filter', 'localeSensitiveComparator',
    'TourenService', 'TourenDetailModel', 'KundenOverviewModel', 'NgTableParams', 'cloneObj', '$routeParams', '$location', 'DetailNavigationService',
    function($scope, $rootScope, $filter, localeSensitiveComparator,TourenService, TourenDetailModel,KundenOverviewModel, NgTableParams, cloneObj, $routeParams, $location, DetailNavigationService) {
      $rootScope.viewId = 'D-Tou';
      
      $scope.unsortedTourlieferungen = [];
      $scope.sortedTourlieferungen = [];
      $scope.loading = false;

      $scope.query = {
        aktiveAbos: true
      };

      var defaults = {
        model: {
          id: undefined,
          name: '',
          beschreibung: undefined,
          tourlieferungen: []
        }
      };

      $scope.listToUse = function(id) {
        if ($filter('filter')($scope.sortedTourlieferungen,{id:id},true)[0] === undefined){
           return $scope.unsortedTourlieferungen;
        }
        else { return $scope.sortedTourlieferungen; }
      };

      $scope.navigateToKunde = function(id) {
          $scope.filteredEntries = [];
          var listKundeIds = []
          var list = $scope.listToUse(id)
          var currentKundeId = $filter('filter')(list,{id:id},true)[0];

          angular.forEach(list, function(tour){
              listKundeIds.push(tour.kundeId);
          });

          var allEntries = KundenOverviewModel.query({
          }, function() {
              angular.forEach(listKundeIds, function(kundeId){
                  $scope.filteredEntries.push($filter('filter')(allEntries,{id:kundeId},true)[0]);
              });
              DetailNavigationService.detailFromOverview(currentKundeId.kundeId, $scope, 'kunden', $location.url());
          });
      };

      $scope.save = function() {
        return $scope.tour.$save(function() {
          $scope.tourForm.$setPristine();
        });
      };

      $scope.created = function(id) {
        $location.path('/touren/' + id);
      };

      $scope.delete = function() {
        if (!$scope.isDeletable()) {
          return;
        }
        return $scope.tour.$delete();
      };

      $scope.isDeletable = function() {
        if ($scope.tour) {
          return $scope.tour.anzahlAbonnenten === 0;
        }
      };

      $scope.backToList = function() {
        $location.path('/touren');
      };

      $scope.loadTour = function() {
        TourenDetailModel.get({
          id: $routeParams.id,
          aktiveOnly: $scope.query.aktiveAbos
        }, function(result) {
          $scope.tour = result;
          $scope.unsortedTourlieferungen = [];
          $scope.sortedTourlieferungen = [];
          $scope.checkUnsorted();
        });
      };

      $scope.onSort = function(movedTourlieferung, partFrom, partTo) {
        //check if there is other entries from same customer
        if (partFrom === $scope.unsortedTourlieferungen && partTo === $scope.sortedTourlieferungen) {
          angular.forEach($scope.unsortedTourlieferungen, function(tourlieferung) {
            if(movedTourlieferung.kundeId === tourlieferung.kundeId) {
              $scope.unsortedTourlieferungen.splice($scope.unsortedTourlieferungen.indexOf(movedTourlieferung));
              $scope.sortedTourlieferungen.splice($scope.sortedTourlieferungen.indexOf(movedTourlieferung), 0, tourlieferung);
            }
          });
        }
        if (partFrom === $scope.sortedTourlieferungen && partTo === $scope.sortedTourlieferungen) {
          angular.forEach($scope.sortedTourlieferungen, function(tourlieferung) {
            if(movedTourlieferung.kundeId === tourlieferung.kundeId) {
              $scope.sortedTourlieferungen.splice($scope.sortedTourlieferungen.indexOf(movedTourlieferung), 0,
                $scope.sortedTourlieferungen.splice($scope.sortedTourlieferungen.indexOf(tourlieferung), 1)[0]);
            }
          });
        }
        // update the index of each sorted tourlieferung entry
        if (partTo === $scope.sortedTourlieferungen) {
          angular.forEach($scope.sortedTourlieferungen, function(tourlieferung, index) {
            tourlieferung.sort = index;
          });
        }

        // disable dropping back to unsorted
        if (partTo === $scope.unsortedTourlieferungen && angular.isDefined(movedTourlieferung.sort)) {
          $scope.unsortedTourlieferungen.splice(movedTourlieferung);
        }
        $scope.checkUnsorted();
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.tour) && angular.isDefined($scope.tour.id);
      };

      $scope.fullName = function() {
        if ($scope.tour && $scope.tour.name) {
          return 'Tour: ' + $scope.tour.name;
        }
        return undefined;
      };

      $scope.checkUnsorted = function() {
        var hasUnsorted = false;
        angular.forEach($scope.tour.tourlieferungen, function(tourlieferung) {
          if (angular.isUndefined(tourlieferung.sort)) {
            hasUnsorted = true;
            if ($scope.unsortedTourlieferungen.indexOf(tourlieferung) === -1) {
              $scope.unsortedTourlieferungen.push(tourlieferung);
            }
          } else {
            if ($scope.sortedTourlieferungen.indexOf(tourlieferung) === -1) {
              $scope.sortedTourlieferungen.push(tourlieferung);
            }
          }
        });
        if(hasUnsorted) {
          $scope.unsortedTourlieferungen = $filter('orderBy')($scope.unsortedTourlieferungen, 'kundeBezeichnung', true, localeSensitiveComparator);
        }
        $scope.hasUnsorted = hasUnsorted;
      };

      $scope.$watch('query.aktiveAbos', function() {
        $scope.loadTour();
      }, true);

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.tour = new TourenDetailModel(defaults.model);
      } else {
        $scope.loadTour();
      }
    }
  ]);
