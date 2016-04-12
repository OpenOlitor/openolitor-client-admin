'use strict';

/**
 */
angular.module('openolitor')
  .controller('ProjektSettingsController', ['$scope', '$filter',
    'ngTableParams',
    'KundentypenService',
    'KundentypenModel',
    'ProduktekategorienService',
    'ProduktekategorienModel',
    'ProjektService',
    'ProjektModel',
    'EnumUtil',
    'MONATE',
    'WAEHRUNG',
    'Upload',
    'msgBus',
    'API_URL',
    function($scope, $filter, ngTableParams, KundentypenService,
      KundentypenModel, ProduktekategorienService, ProduktekategorienModel,
      ProjektService, ProjektModel, EnumUtil, MONATE, WAEHRUNG, Upload, msgBus, API_URL
    ) {
      $scope.editMode = false;
      $scope.templateKundentyp = {};
      $scope.templateProduktekategorie = {};
      $scope.projekt = {
        preiseSichtbar: true,
        preiseEditierbar: false,
        emailErforderlich: true,
        waehrung: 'CHF',
        geschaeftsjahr: new Date(new Date().getYear(), 1, 1)
      };

      $scope.waehrungen = EnumUtil.asArray(WAEHRUNG);

      $scope.monate = EnumUtil.asArray(MONATE);

      $scope.tage = Array();
      for (var i=1; i<=31; i++) {
        $scope.tage.push({id: i});
      }

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

      //watch for set of produktekategorien
      $scope.$watch(ProduktekategorienService.getProduktekategorien,
        function(list) {
          if (list) {
            $scope.produktekategorien = [];
            angular.forEach(list, function(item) {
              if (item.id) {
                $scope.produktekategorien.push(item);
              }
            });
            $scope.produktekategorienTableParams.reload();
          }
        });

      //watch for existing projekt
      $scope.$watch(ProjektService.getProjekt,
        function(projekt) {
          if (projekt) {
            $scope.projekt = projekt;
            $scope.logoUrl = $scope.generateLogoUrl();
          } else {
            $scope.projekt = new ProjektModel($scope.projekt);
            $scope.logoUrl = undefined;
          }
          if(!angular.isUndefined($scope.projekt.geschaeftsjahr)) {
            $scope.projekt.geschaeftsjahr.tag = $scope.projekt.geschaeftsjahr.getDate();
            $scope.projekt.geschaeftsjahr.monat = $scope.projekt.geschaeftsjahr.getMonth() + 1;
          }
        });

      $scope.switchToEditMode = function() {
        $scope.editMode = true;
      };

      $scope.changedKundentypen = {};
      $scope.deletingKundentypen = {};
      $scope.changedProduktekategorien = {};
      $scope.deletingProduktekategorien = {};
      $scope.modelChangedKundentyp = function(kundentyp) {
        if (!(kundentyp.kundentyp in $scope.changedKundentypen)) {
          $scope.changedKundentypen[kundentyp.kundentyp] = kundentyp;
        }
      };
      $scope.hasChangesKundentypen = function() {
        return Object.getOwnPropertyNames($scope.changedKundentypen).length >
          0;
      };

      $scope.modelChangedProduktekategorie = function(produktekategorie) {
        if (!(produktekategorie.produktekategorie in $scope.changedProduktekategorien)) {
          $scope.changedProduktekategorien[produktekategorie.id] =
            produktekategorie;
        }
      };

      $scope.hasChangesProduktekategorien = function() {
        return Object.getOwnPropertyNames($scope.changedProduktekategorien)
          .length > 0;
      };

      $scope.saveKundentypen = function() {
        if (!$scope.hasChangesKundentypen()) {
          return;
        }
        $scope.templateKundentyp.updating = true;
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
      };

      $scope.addKundentyp = function() {
        if ($scope.createKundentypForm.$invalid) {

          angular.forEach($scope.createKundentypForm.$error, function(
            field) {
            angular.forEach(field, function(errorField) {
              errorField.$setTouched();
            });
          });
          return;
        }
        var newModel = new KundentypenModel({
          id: undefined,
          kundentyp: $scope.templateKundentyp.kundentyp
        });
        newModel.$save();
        $scope.templateKundentyp.creating = true;
        $scope.templateKundentyp.kundentyp = undefined;
      };

      $scope.saveProduktekategorie = function() {
        if (!$scope.hasChangesProduktekategorien()) {
          return;
        }
        $scope.templateProduktekategorie.updating = true;
        angular.forEach($scope.changedProduktekategorien, function(
          produktekategorie) {
          produktekategorie.$save();
        });
      };

      $scope.deletingProduktekategorie = function(produktekategorie) {
        return $scope.deletingKundentypen[produktekategorie.id];
      };

      $scope.deleteProduktekategorie = function(produktekategorie) {
        $scope.deletingProduktekategorie[produktekategorie.id] = true;
        produktekategorie.$delete();
      };

      $scope.addProduktekategorie = function() {
        if ($scope.createProduktekategorieForm.$invalid) {

          angular.forEach($scope.createProduktekategorieForm.$error,
            function(
              field) {
              angular.forEach(field, function(errorField) {
                errorField.$setTouched();
              });
            });
          return;
        }
        var newModel = new ProduktekategorienModel({
          id: undefined,
          beschreibung: $scope.templateProduktekategorie.produktekategorie
        });
        newModel.$save();
        $scope.templateProduktekategorie.creating = true;
        $scope.templateProduktekategorie.produktekategorie = undefined;
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.templateKundentyp.creating = undefined;

          $scope.kundentypen.push(new KundentypenModel(msg.data));
          $scope.kundentypenTableParams.reload();

          $scope.$apply();
        } else if (msg.entity === 'Produktekategorie') {
          $scope.templateProduktekategorie.creating = undefined;

          $scope.produktekategorien.push(new ProduktekategorienModel(msg.data));
          $scope.produktekategorienTableParams.reload();

          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.templateKundentyp.updating = undefined;
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'CustomKundentyp') {
          $scope.templateKundentyp.deleting = undefined;
          $scope.deletingKundentypen[msg.data.id] = undefined;
          angular.forEach($scope.kundentypen, function(kundentyp) {
            if (kundentyp.id === msg.data.id) {
              var index = $scope.kundentypen.indexOf(kundentyp);
              if (index > -1) {
                $scope.kundentypen.splice(index, 1);
              }
            }
          });

          $scope.kundentypenTableParams.reload();
          $scope.$apply();
        } else if (msg.entity === 'Produktekategorie') {
          $scope.templateProduktekategorie.deleting = undefined;
          $scope.deletingProduktekategorie[msg.data.id] = undefined;
          angular.forEach($scope.produktekategorien, function(
            produktekategorie) {
            if (produktekategorie.id === msg.data.id) {
              var index = $scope.produktekategorien.indexOf(
                produktekategorie);
              if (index > -1) {
                $scope.produktekategorien.splice(index, 1);
              }
            }
          });

          $scope.produktekategorienTableParams.reload();
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

      if (!$scope.produktekategorienTableParams) {
        //use default tableParams
        $scope.produktekategorienTableParams = new ngTableParams({ // jshint ignore:line
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
            if (!$scope.produktekategorien) {
              return;
            }
            // use build-in angular filter
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.produktekategorien, params.orderBy()) :
              $scope.produktekategorien;

            params.total(orderedData.length);
            $defer.resolve(orderedData);
          }

        });
      }

      $scope.saveProjekt = function() {
        var tag = $scope.projekt.geschaeftsjahr.tag;
        var monat = $scope.projekt.geschaeftsjahr.monat - 1;
        $scope.projekt.geschaeftsjahr = new Date();
        $scope.projekt.geschaeftsjahr.setDate(tag);
        $scope.projekt.geschaeftsjahr.setMonth(monat);
        return $scope.projekt.$save();
      };

      $scope.logoFile = undefined;
      // upload on file select or drop
      $scope.uploadLogo = function(file) {
        if (!file) {
          return;
        }
        Upload.upload({
          url: $scope.logoUrl,
          data: {
            file: file
          }
        }).then(function(resp) {
          console.log('Success ' + resp.config.data.file.name +
            'uploaded. Response: ' + resp.data);
          //regenerate logo url to reload image
          $scope.logoUrl = $scope.generateLogoUrl();
        }, function(resp) {
          console.log('Error status: ' + resp.status);
        });
      };

      $scope.generateLogoUrl = function() {
        return API_URL + 'projekt/' + $scope.projekt.id + '/logo?' + new Date()
          .getTime();
      };
      $scope.logoUrl = $scope.generateLogoUrl();
    }
  ]);
