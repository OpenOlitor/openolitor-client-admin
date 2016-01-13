'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProjektSettingsController', ['$scope', '$filter',
    'ngTableParams',
    'KundentypenService',
    'KundentypenModel',
    'msgBus',
    function($scope, $filter, ngTableParams, KundentypenService,
      KundentypenModel, msgBus) {

      $scope.template = {};

      //watch for set of kundentypen
      $scope.$watch(KundentypenService.getKundentypen,
        function(list) {
          if (list) {
            $scope.kundentypen = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.kundentypen.push(item);
              }
            });
            $scope.kundentypenTableParams.reload();
          }
        });

      $scope.changedKundentypen = {};
      $scope.deletingKundentypen = {};
      $scope.modelChanged = function(kundentyp) {
        if (!(kundentyp.kundentyp in $scope.changedKundentypen)) {
          $scope.changedKundentypen[kundentyp.kundentyp] = kundentyp;
        }
      };
      $scope.hasChanges = function() {
        return Object.getOwnPropertyNames($scope.changedKundentypen).length >
          0;
      };

      $scope.save = function() {
        if (!$scope.hasChanges()) {
          return;
        }
        $scope.template.updating = true;
        angular.forEach($scope.changedKundentypen, function(kundentyp) {
          kundentyp.$save();
        });
      };

      $scope.deletingKundentyp = function(kundentyp) {
        return $scope.deletingKundentypen[kundentyp.kundentyp];
      };

      $scope.deleteKundentyp = function(kundentyp) {
        $scope.deletingKundentypen[kundentyp.kundentyp] = true;
        kundentyp.$delete();
      }

      $scope.addKundentyp = function() {
        if ($scope.createKundentypForm.$invalid) {

          angular.forEach($scope.createKundentypForm.$error, function(
            field) {
            angular.forEach(field, function(errorField) {
              errorField.$setTouched();
            })
          });
          return;
        }
        var newModel = new KundentypenModel({
          id: undefined,
          kundentyp: $scope.template.kundentyp
        });
        newModel.$save();
        $scope.template.creating = true;
        $scope.template.kundentyp = undefined;
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.template.creating = undefined;

          $scope.kundentypen.push(new KundentypenModel(msg.data));
          $scope.kundentypenTableParams.reload();

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.template.updating = undefined;
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.template.deleting = undefined;
          $scope.deletingKundentypen[msg.data.id] = undefined;
          angular.forEach($scope.kundentypen, function(kundentyp) {
            if (kundentyp.id === msg.data.id) {
              var index = $scope.kundentypen.indexOf(kundentyp)
              if (index > -1) {
                $scope.kundentypen.splice(index, 1);
              }
            }
          })

          $scope.kundentypenTableParams.reload();
          $scope.$apply();
        }
      });

      if (!$scope.kundentypenTableParams) {
        //use default tableParams
        $scope.kundentypenTableParams = new ngTableParams({ // jshint ignore:line
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
          getData: function($defer, params) {
            if (!$scope.kundentypen) {
              return;
            }
            // use build-in angular filter
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.kundentypen, params.orderBy()) :
              $scope.kundentypen;

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }
    }
  ]);
