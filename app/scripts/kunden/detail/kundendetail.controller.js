'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('KundenDetailController', ['$scope', '$rootScope', '$filter',
    '$routeParams', '$http',
    '$location', '$uibModal', 'gettext', 'KundenDetailModel',
    'PendenzDetailModel',
    'KundentypenService', 'alertService',
    'EnumUtil', 'DataUtil', 'PENDENZSTATUS', 'ANREDE', 'ABOTYPEN', 'API_URL',
    'msgBus', 'lodash', 'KundenRechnungenModel', 'ooAuthService',
    function($scope, $rootScope, $filter, $routeParams, $http, $location,
      $uibModal,
      gettext,
      KundenDetailModel, PendenzDetailModel, KundentypenService, alertService,
      EnumUtil, DataUtil,
      PENDENZSTATUS, ANREDE, ABOTYPEN, API_URL,
      msgBus, lodash, KundenRechnungenModel, ooAuthService) {

      var defaults = {
        model: {
          id: undefined,
          typen: [KundentypenService.VEREINSMITGLIED],
          ansprechpersonen: [{
            id: undefined,
            anrede: undefined
          }],
          pendenzen: [],
          abweichendeLieferadresse: false
        }
      };

      $scope.abotypenArray = EnumUtil.asArray(ABOTYPEN).map(function(typ) {
        return typ.id;
      });

      $scope.pendenzstatus = EnumUtil.asArray(PENDENZSTATUS);
      $scope.anreden = ANREDE;
      $scope.updatingAbo = {};
      $scope.selectedAbo = undefined;

      $scope.loadKunde = function() {
        KundenDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.kunde = result;

          if ($routeParams.aboId) {
            var abo = lodash.filter($scope.kunde.abos,
              function(a) {
                return a.id === parseInt($routeParams.aboId);
              });
            if (abo && abo.length === 1) {
              $scope.selectAbo(abo[0]);
            }
          }

          $scope.rechnungen = KundenRechnungenModel.query({
            kundeId: $scope.kunde.id
          });
        });
      };

      if (!$routeParams.id) {
        $scope.kunde = new KundenDetailModel(defaults.model);
        $scope.pendenzen = [];
      } else {
        $scope.loadKunde();
      }


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
        $scope.kunde.ansprechpersonen.push({
          id: undefined,
          anrede: ''
        });
      };

      $scope.removePerson = function(index) {
        var person = $scope.kunde.ansprechpersonen.splice(index, 1);
        //remove as well from remote side
        if ($routeParams.id && person[0].id) {
          $http.delete(API_URL + 'kunden/' + $routeParams.id + '/personen/' +
            person[0].id);
        }
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
          //remove as well from remote side
          var p = lodash.extend({
            kundeId: $routeParams.id
          }, pendenz);
          new PendenzDetailModel(p).$delete();
        }
      };

      $scope.savePendenz = function(pendenz) {
        var p = lodash.extend({
          kundeId: $routeParams.id
        }, pendenz);
        new PendenzDetailModel(p).$save();
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
        return $scope.kunde.$save();
      };

      $scope.created = function(id) {
        $location.path('/kunden/' + id);
      };

      $scope.backToList = function() {
        $location.path('/kunden');
      };

      $scope.canDelete = function() {
        return $scope.kunde && $scope.kunde.anzahlAbos === 0 && !lodash.find(
          $scope.kunde.ansprechpersonen,
          function(person) {
            return person.id === ooAuthService.getUser().personId;
          });
      };

      $scope.delete = function() {
        if (!$scope.canDelete()) {
          return;
        }
        return $scope.kunde.$delete();
      };
      $scope.isNewAbo = function() {
        return $scope.newAbo !== undefined;
      };

      $scope.showCreateAboDialog = function() {
        $scope.newAbo = {};
      };

      $scope.onAboCreated = function() {
        $scope.newAbo = undefined;
      };

      $scope.onAboCreateCanceled = function() {
        $scope.newAbo = undefined;
      };

      $scope.updatingAbo = function(abo) {
        return abo.id && $scope.updatingAbo[
          abo.id];
      };

      $scope.selectAbo = function(abo) {
        if ($scope.selectedAbo === abo) {
          $scope.selectedAbo = undefined;
        } else {
          $scope.selectedAbo = abo;
        }
      };

      var isAboEntity = function(entity) {
        return $scope.abotypenArray.indexOf(entity) > -1;
      };

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          if ($scope.kunde) {
            if ($scope.kunde.abos) {
              $scope.kunde.abos.push(msg.data);
            } else {
              $scope.kunde.abos = [msg.data];
            }
            alertService.addAlert('info', 'Abo wurde erstellt');
            $scope.$apply();
          }
        } else if (msg.entity === 'Pendenz') {
          var pendenzen = lodash.filter($scope.kunde.pendenzen, function(
            p) {
            return p.id === undefined &&
              moment(p.datum).startOf('day').isSame(moment(msg.data.datum)
                .startOf('day')) &&
              p.bemerkung === msg.data.bemerkung;
          });
          lodash.map(pendenzen, function(p) {
            p.editable = false;
            p.id = msg.data.id;
          });
          $scope.$apply();
        } else if (msg.entity === 'Person') {
          if ($scope.kunde && $scope.kunde.ansprechpersonen) {
            angular.forEach($scope.kunde.ansprechpersonen, function(
              person) {
              if (person.anrede === msg.data.anrede && person.vorname ===
                msg.data.vorname && person.name === msg.data.name) {
                //set id that entity won't get created twice
                person.id = msg.data.id;
                $scope.$apply();
                return;
              }
            });
          }
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          if ($scope.kunde) {
            angular.forEach($scope.kunde.abos, function(abo) {
              if (abo.id === msg.data.id) {
                DataUtil.update(msg.data, abo);
                $scope.$apply();
                return;
              }
            });
          }
        } else if (msg.entity === 'Pendenz') {
          lodash.map(lodash.filter($scope.kunde.pendenzen, function(p) {
            return p.id === msg.data.id;
          }), function(p) {
            p.editable = false;
          });
          $scope.$apply();
        } else if (msg.entity === 'Kunde') {
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          if ($scope.kunde) {
            angular.forEach($scope.kunde.abos, function(abo) {
              if (abo.id === msg.data.id) {
                var index = $scope.kunde.abos.indexOf(abo);
                if (index > -1) {
                  $scope.kunde.abos.splice(index, 1);
                }
                $scope.selectedAbo = undefined;
                $scope.$apply();
                return;
              }
            });
          }
        }
      });
    }
  ]);
