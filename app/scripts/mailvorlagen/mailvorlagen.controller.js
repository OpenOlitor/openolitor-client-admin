'use strict';

/**
 */
angular.module('openolitor-admin').controller('MailvorlagenController', [
  '$scope',
  '$rootScope',
  'MailvorlagenModel',
  'msgBus',
  'DataUtil',
  'lodash',
  'NgTableParams',
  'gettext',
  'Upload',
  'appConfig',
  'FileUtil',
  'MailvorlagenService',

  function(
    $scope,
    $rootScope,
    MailvorlagenModel,
    msgBus,
    DataUtil,
    lodash,
    NgTableParams,
    gettext,
    Upload,
    appConfig,
    FileUtil,
    MailvorlagenService
  ) {
    $rootScope.viewId = 'S-MaiT';

    $scope.template = {
      templateType: $scope.typ
    };
    $scope.title = $scope.typ.replace('Vorlage', '');

    $scope.addVorlage = function() {
      var vorlage = new MailvorlagenModel($scope.template);
      $scope.selectedVorlage = vorlage;
      $scope.template.creating = true;
    };

    $scope.saveVorlage = function(vorlage) {
      vorlage.$save();
      vorlage.mailvorlagenupdating = true;
    };

    $scope.selectVorlage = function(vorlage, itemId) {
      var allRows = angular.element('div[name="vorlageTable"] table tbody tr');
      allRows.removeClass('row-selected');

      if ($scope.selectedVorlage === vorlage) {
        $scope.selectedVorlage = undefined;
      } else {
        $scope.selectedVorlage = vorlage;
        var row = angular.element('#' + itemId);
        row.addClass('row-selected');
      }
    };

    $scope.unselectVorlage = function() {
      $scope.selectedVorlage = undefined;
      var allRows = angular.element('div[name="vorlageTable"] table tbody tr');
      allRows.removeClass('row-selected');
    };

    $scope.unselectVorlageFunct = function() {
      return $scope.unselectVorlage;
    };

    $scope.inProgress = function(vorlage) {
      return (
        !angular.isUndefined(vorlage) && (vorlage.deleting || vorlage.updating)
      );
    };

    $scope.deleteVorlage = function(vorlage) {
      vorlage.deleting = true;
      vorlage.$delete();
    };

    var unwatch = $scope.$watch(
      function() {
        return MailvorlagenService.getVorlagen($scope.typ);
      },
      function() {
        if ($scope.tableParams) {
          $scope.tableParams.reload();
        }
      }
    );
    $scope.$on('destroy', function() {
      unwatch();
    });

    if (!$scope.tableParams) {
      //use default tableParams
      $scope.tableParams = new NgTableParams(
        {
          // jshint ignore:line
          page: 1,
          count: 1000,
          sorting: {
            name: 'asc'
          }
        },
        {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.vorlagen) {
              $scope.vorlagen = MailvorlagenService.getVorlagen($scope.typ);
            }

            var vorlagenLenght = $scope.vorlagen ? $scope.vorlagen.length : 0;

            params.total(vorlagenLenght);
            return $scope.vorlagen;
          }
        }
      );
    }

    msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
      if (msg.entity === 'MailTemplate') {
        if ($scope.typ === msg.data.templateType) {
          $scope.vorlagen.push(msg.data);
          $scope.template.creating = false;
          $scope.selectVorlage = undefined;
          $scope.selectedVorlage = undefined;
          $scope.tableParams.reload();
          $scope.$apply();
        }
      }
    });

    msgBus.onMsg('EntityModified', $scope, function(event, msg) {
      if (msg.entity === 'MailTemplate') {
        if ($scope.typ === msg.data.templateType) {
          $scope.unselectVorlage();
          $scope.tableParams.reload();
        }
      }
    });

    msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
      if (msg.entity === 'MailTemplate') {
        if ($scope.typ === msg.data.templateType) {
          $scope.template.creating = false;
          $scope.selectVorlage = undefined;
          $scope.selectedVorlage = undefined;
          lodash.remove($scope.vorlagen, function(v) {
            return v.id === msg.data.id;
          });

          $scope.tableParams.reload();
          $scope.$apply();
        }
      }
    });
  }
]);
