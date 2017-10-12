'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ReportvorlagenController', ['$scope', 'ReportvorlagenModel', 'msgBus',
    'DataUtil', 'lodash', 'NgTableParams', 'gettext', 'Upload', 'API_URL',
    'FileUtil', 'ReportvorlagenService',

    function($scope, ReportvorlagenModel, msgBus, DataUtil, lodash, NgTableParams,
      gettext, Upload, API_URL, FileUtil, ReportvorlagenService) {
      $scope.template = {
        typ: $scope.typ
      };
      $scope.title = $scope.typ.replace('Vorlage', '');

      $scope.addVorlage = function() {
        var vorlage = new ReportvorlagenModel($scope.template);
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

      var unwatch = $scope.$watch(function() {
        return ReportvorlagenService.getVorlagen($scope.typ);
      }, function() {
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

            var vorlagen = ReportvorlagenService.getVorlagen($scope.typ);

            var allValues = (vorlagen) ? lodash.concat(values, vorlagen) : values;

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

      msgBus.onMsg('ProjektVorlageCreated', $scope, function(event, msg) {
        if ($scope.typ === msg.vorlage.typ) {
          $scope.template.creating = false;
          $scope.tableParams.reload();
          $scope.$apply();
        }
      });

      msgBus.onMsg('ProjektVorlageModified', $scope, function(event, msg) {
        if ($scope.typ === msg.vorlage.typ) {
          msg.vorlage.editing = false;
          msg.vorlage.updateing = false;
          $scope.tableParams.reload();
        }
      });

      msgBus.onMsg('ProjektVorlageDeleted', $scope, function(event, msg) {
        if ($scope.typ === msg.vorlage.typ) {
          $scope.tableParams.reload();
          $scope.$apply();
        }
      });
    }
  ]);
