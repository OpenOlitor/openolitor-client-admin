'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('VorlagenController', ['$scope', 'VorlagenModel', 'msgBus',
    'DataUtil', 'lodash', 'NgTableParams', 'gettext', 'Upload', 'API_URL',
    'FileUtil',

    function($scope, VorlagenModel, msgBus, DataUtil, lodash, NgTableParams,
      gettext, Upload, API_URL, FileUtil) {
      $scope.template = {
        typ: $scope.typ
      };
      $scope.title = $scope.typ.replace('Vorlage', '');

      $scope.addVorlage = function() {
        var vorlage = new VorlagenModel($scope.template);
        vorlage.$save();
        $scope.template.creating = true;
      };

      $scope.saveVorlage = function(vorlage) {
        vorlage.$save();
        vorlage.updateing = true;
      };

      $scope.editVorlage = function(vorlage) {
        vorlage.editing = true;
      };

      $scope.inProgress = function(vorlage) {
        return vorlage.deleting || vorlage.updating || vorlage.uploading;
      };

      $scope.deleteVorlage = function(vorlage) {
        vorlage.deleting = true;
        vorlage.$delete();
      };

      var unwatch = $scope.$watch('vorlagen', function() {
        if ($scope.tableParams) {
          $scope.tableParams.reload();
        }
      });
      $scope.$on('destroy', function() {
        unwatch();
      });

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
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
            //concat with default vorlage
            var values = [{
              name: gettext('Standardvorlage'),
              default: true
            }];

            var allValues = ($scope.vorlagen) ? lodash.concat(values,
              $scope.vorlagen) : values;

            params.total(allValues.length);
            return allValues;
          }

        });
      }

      var vorlageUrl = function(vorlage) {
        var subPath = (vorlage.default) ? $scope.typ : vorlage.id;
        return 'vorlagen/' + subPath + '/dokument';
      };

      $scope.downloadVorlage = function(vorlage) {
        vorlage.downloading = true;
        FileUtil.downloadGet(vorlageUrl(vorlage), vorlage.name,
          'application/vnd.oasis.opendocument.text',
          function() {
            vorlage.downloading = false;
          });
      };

      // upload on file select or drop
      $scope.uploadVorlage = function(vorlage, file) {
        if (!file) {
          return;
        }
        vorlage.uploading = true;
        Upload.upload({
          url: API_URL + vorlageUrl(vorlage),
          data: {
            file: file
          }
        }).then(function() {
          vorlage.uploading = false;
        }, function(resp) {
          console.log('Error status: ' + resp.status);
          vorlage.uploading = false;
        });
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage' && $scope.typ === msg.data
          .typ) {
          var newModel = new VorlagenModel(msg.data);
          if (!$scope.vorlagen) {
            $scope.vorlagen = [];
          }
          $scope.template.name = undefined;
          $scope.vorlagen.push(newModel);
          $scope.template.creating = false;
          $scope.tableParams.reload();
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage' && $scope.typ === msg.data
          .typ) {
          var vorlage = lodash.find($scope.vorlagen, function(r) {
            return r.id === msg.data.id;
          });
          if (vorlage) {
            DataUtil.update(msg.data, vorlage);
            vorlage.editing = false;
            vorlage.updateing = false;
            $scope.tableParams.reload();
            $scope.$apply();
          }
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage' && $scope.typ === msg.data
          .typ) {
          var index = lodash.findIndex($scope.vorlagen, function(vorlage) {
            return vorlage.id === msg.data.id;
          });
          if (index >= 0) {
            $scope.vorlagen.splice(index, 1);
            $scope.tableParams.reload();
            $scope.$apply();
          }
        }
      });
    }
  ]);
