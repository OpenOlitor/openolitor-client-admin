'use strict';

/**
 */
angular.module('openolitor')
  .controller('KundenDetailController', ['$scope', '$rootScope', '$filter',
    '$routeParams',
    '$location', '$uibModal', 'gettext', 'KundenDetailModel',
    'KundentypenService',
    'EnumUtil', 'PENDENZSTATUS', 'msgBus', '$log',
    function($scope, $rootScope, $filter, $routeParams, $location, $uibModal,
      gettext,
      KundenDetailModel, PersonDetailModel, KundentypenService, EnumUtil,
      PENDENZSTATUS, ANREDE,
      msgBus, $log) {

      var defaults = {
        model: {
          id: undefined,
          typen: [KundentypenService.VEREINSMITGLIED],
          ansprechpersonen: [{
            id: undefined
          }],
          pendenzen: [],
        }
      };

      $scope.pendenzstatus = EnumUtil.asArray(PENDENZSTATUS);

      $scope.loadKunde = function() {
        KundenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.kunde = result;
        });
      };

      if (!$routeParams.id) {
        $scope.kunde = new KundenDetailModel(defaults.model);
        $scope.pendenzen = [];
      } else {
        $scope.loadKunde();
      }

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'Kunde') {
          $scope.loadKunde();
          $rootScope.$apply();
        }
      });

      $scope.open = {
        pendenzdatum: false,
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.kundeBezeichnung = function() {
        if ($scope.kunde && $scope.kunde.ansprechpersonen) {
          if ($scope.kunde.ansprechpersonen.length > 1) {
            return $scope.kunde.bezeichnung;
          } else {
            return $scope.fullName(0);
          }
        }
        return undefined;
      };

      $scope.personEmail = function(index) {
        var ret = ' ';
        if ($scope.kunde.ansprechpersonen[index].email) {
          ret = $scope.kunde.ansprechpersonen[index].email;
        }
        return ret;
      };

      $scope.personPhone = function(index) {
        var ret = ' ';
        var foundPhone = false;
        if ($scope.kunde.ansprechpersonen[index].telefonMobil) {
          ret = $scope.kunde.ansprechpersonen[index].telefonMobil;
          foundPhone = true;
        }
        if (!foundPhone && $scope.kunde.ansprechpersonen[index].telefonFestnetz) {
          ret = $scope.kunde.ansprechpersonen[index].telefonFestnetz;
        }
        return ret;
      };

      $scope.personClass = function(index) {
        if ($scope.kunde.ansprechpersonen[index].id === undefined || $scope
          .kunde.ansprechpersonen.length === 1) {
          return 'in';
        }
      };

      $scope.fullName = function(index) {
        if ($scope.kunde && $scope.kunde.ansprechpersonen && $scope.kunde.ansprechpersonen[
            index] && $scope.kunde.ansprechpersonen[index].vorname &&
          $scope.kunde.ansprechpersonen[
            index].name) {
          var anrede = ($scope.kunde.ansprechpersonen[index].anrede) ?
            $scope.kunde.ansprechpersonen[index].anrede + ' ' : '';

          return anrede + $scope.kunde.ansprechpersonen[index].vorname +
            ' ' +
            $scope.kunde.ansprechpersonen[
              index].name;
        }
        return undefined;
      };

      $scope.addPerson = function() {
        $scope.kunde.ansprechpersonen.push({});
      };

      $scope.removePerson = function(index) {
        var ansprechperson = $scope.kunde.ansprechpersonen.splice(index, 1);
        ansprechperson.$delete();
      };

      $scope.addPendenz = function() {
        $scope.kunde.pendenzen.push({
          id: undefined,
          datum: new Date(),
          status: PENDENZSTATUS.AUSSTEHEND,
          editable: true
        });
      };

      $scope.editPendenz = function(pendenz) {
        pendenz.editable = true;
      };

      $scope.deletePendenz = function(pendenz) {
        var index = $scope.kunde.pendenzen.indexOf(pendenz);
        if (index > -1) {
          $scope.kunde.pendenzen.splice(index, 1);
        }
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.kunde) && angular.isDefined($scope.kunde
          .id);
      };

      $scope.hasLieferadresse = function() {
        return angular.isDefined($scope.kunde) && (
          (angular.isDefined($scope.kunde.strasseLieferung) && $scope.kunde
            .strasseLieferung !== '') ||
          (angular.isDefined($scope.kunde.plzLieferung) && $scope.kunde.plzLieferung !==
            '') ||
          (angular.isDefined($scope.kunde.ortLieferung) && $scope.kunde.ortLieferung !==
            '')
        );
      };

      $scope.save = function() {
        //force rewriting of ansprechperson
        if ($scope.kunde.ansprechpersonen.length === 1) {
          $scope.kunde.bezeichnung = undefined;
        }
        angular.forEach($scope.kunde.pendenzen, function(value) {
          value.editable = false;
        });
        return $scope.kunde.$save();
      };

      $scope.created = function(id) {
        $location.path('/kunden/' + id);
      };

      $scope.backToList = function() {
        $location.path('/kunden');
      };

      $scope.delete = function() {
        return $scope.kunde.$delete();
      };

      $scope.showCreateAboDialog = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/kunden/detail/abo/create-abo.html',
          controller: 'AbosDetailController',
          resolve: {
            createKundeId: function() {
              return $scope.kunde.id;
            }
          }
        });

        modalInstance.result.then(function() {

        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    }
  ]);
