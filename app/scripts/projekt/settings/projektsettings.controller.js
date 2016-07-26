'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ProjektSettingsController', ['$scope', '$filter',
    'NgTableParams',
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
    function($scope, $filter, NgTableParams, KundentypenService,
      KundentypenModel, ProduktekategorienService, ProduktekategorienModel,
      ProjektService, ProjektModel, EnumUtil, MONATE, WAEHRUNG, Upload, msgBus, API_URL
    ) {
      $scope.templateKundentyp = {};
      $scope.templateProduktekategorie = {};

      // first fake to true to work around bs-switch bug
      $scope.editMode = true;

      $scope.waehrungen = EnumUtil.asArray(WAEHRUNG);

      $scope.monate = EnumUtil.asArray(MONATE);

      $scope.tage = [];
      for (var i = 1; i <= 31; i++) {
        $scope.tage.push({
          id: i
        });
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


      ProjektService.resolveProjekt().then(function(projekt) {
        if (projekt) {
          $scope.projekt = projekt;
          $scope.logoUrl = $scope.generateLogoUrl();
          $scope.editMode = false;
        } else {
          $scope.editMode = true;
        }
      }, function(error) {
        console.log('error', error);
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
        $scope.kundentypenTableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 1000,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.kundentypen) {
              return;
            }
            // use build-in angular filter
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.kundentypen, params.orderBy()) :
              $scope.kundentypen;

            params.total(orderedData.length);
            return orderedData;
          }

        });
      }

      if (!$scope.produktekategorienTableParams) {
        //use default tableParams
        $scope.produktekategorienTableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 1000,
          sorting: {
            name: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.produktekategorien) {
              return;
            }
            // use build-in angular filter
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.produktekategorien, params.orderBy()) :
              $scope.produktekategorien;

            params.total(orderedData.length);
            return orderedData;
          }

        });
      }

      $scope.saveProjekt = function() {
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
        }).then(function() {
          //regenerate logo url to reload image
          $scope.logoUrl = $scope.generateLogoUrl();
        }, function(resp) {
          console.log('Error status: ' + resp.status);
        });
      };

      $scope.generateLogoUrl = function() {
        return API_URL + 'projekt/' + $scope.projekt.id + '/logo';
      };

      $scope.localeBCP47Pattern = /^(((([A-Za-z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-([A-Za-z]{4}))?(-([A-Za-z]{2}|[0-9]{3}))?(-([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-([0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(x(-[A-Za-z0-9]{1,8})+))?)|(x(-[A-Za-z0-9]{1,8})+)|((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)))$/;
    }
  ]);
