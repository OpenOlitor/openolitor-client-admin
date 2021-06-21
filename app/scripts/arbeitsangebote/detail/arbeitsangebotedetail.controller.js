'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('ArbeitsangeboteDetailController', ['$scope', '$rootScope', '$filter', '$routeParams',
    '$location', 'gettext', 'ArbeitsangeboteDetailModel', 'ARBEITSEINSATZSTATUS',
    'PersonenOverviewModel', 'ArbeitseinsaetzeDetailModel', 'localeSensitiveComparator',
    'NgTableParams', 'lodash', 'OverviewCheckboxUtil', 'msgBus', 'alertService', 'EINSATZEINHEIT',
    '$uibModal', '$log', '$http', 'appConfig',
    function($scope, $rootScope, $filter, $routeParams, $location, gettext,
      ArbeitsangeboteDetailModel, ARBEITSEINSATZSTATUS, PersonenOverviewModel,
      ArbeitseinsaetzeDetailModel, localeSensitiveComparator, NgTableParams, lodash,
      OverviewCheckboxUtil, msgBus, alertService, EINSATZEINHEIT, $uibModal, $log, $http,
      appConfig) {

      $rootScope.viewId = 'D-Aban';

      var defaults = {
        model: {
          id: undefined,
          arbeitskategorien: [],
          mehrPersonenOk: true,
          status: 'neu'
        }
      };

      $scope.filteredEntries = [];

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      $scope.modifDelta = 1;

      $scope.open = {
        start: false
      };

      $scope.tpOptionsVon = {
        showMeridian: false
      };

      $scope.tpOptionsBis = {
        showMeridian: false
      };

      $scope.delete = function() {
        if ($scope.arbeitsangebot.anzahlAbonnenten > 0) {
          return;
        }
        return $scope.arbeitsangebot.$delete();
      };

      $scope.isExisting = function() {
        return angular.isDefined($scope.arbeitsangebot) && angular.isDefined($scope.arbeitsangebot
          .id);
      };


      $scope.save = function() {
        if($scope.arbeitsangebot.status === 'neu') {
          $scope.arbeitsangebot.status = ARBEITSEINSATZSTATUS.INVORBEREITUNG;
        }
        return $scope.arbeitsangebot.$save(function(){
          $scope.arbeitsangebotForm.$setPristine();
        });
      };

      $scope.created = function(id) {
        $location.path('/arbeitsangebote/' + id);
      };

      $scope.backToList = function() {
        $location.path('/arbeitsangebote');
      };

      $scope.delete = function() {
        return $scope.arbeitsangebot.$delete();
      };

      $scope.open = {
        start: false,
        ende: false
      };
      $scope.openCalendar = function(e, date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.modifBis = function(delta) {
         $scope.arbeitsangebot.zeitBis = new Date($scope.arbeitsangebot.zeitBis.setHours($scope.arbeitsangebot.zeitBis.getHours()+delta));
      };

      // watch min and max dates to calculate difference
      $scope.watchMinMaxValues = function() {
        $scope.unwatchMinMaxValues = $scope.$watch(function() {
          var von = !angular.isUndefined($scope.arbeitsangebot) ? $scope.arbeitsangebot.zeitVon : undefined;
          var bis = !angular.isUndefined($scope.arbeitsangebot) ? $scope.arbeitsangebot.zeitBis : undefined;
          return [von, bis];
        }, function() {
          if(angular.isUndefined($scope.arbeitsangebot)) {
            return;
          }
          if($scope.arbeitsangebotInit) {
            $scope.arbeitsangebotInit = false;
            return;
          }
          // min max dates
          $scope.tpOptionsVon.maxDate = $scope.arbeitsangebot.zeitBis;
          $scope.tpOptionsBis.minDate = $scope.arbeitsangebot.zeitVon;

          if ($scope.arbeitsangebot.zeitVon && !$scope.arbeitsangebot.zeitBis) {
            //set default time, 1 hour
            $scope.arbeitsangebot.zeitBis = new Date(new Date($scope.arbeitsangebot.zeitVon).setHours($scope.arbeitsangebot.zeitVon.getHours() + 1 ));
          }

          if ($scope.arbeitsangebot.zeitVon && $scope.arbeitsangebot.zeitBis) {
              var diff = $scope.arbeitsangebot.zeitBis.getTime() - $scope.arbeitsangebot.zeitVon.getTime();
              if(diff < 0) {
                $scope.arbeitsangebot.zeitBis = new Date(new Date($scope.arbeitsangebot.zeitVon).setHours($scope.arbeitsangebot.zeitVon.getHours() + 1 ));
                //alertService.addAlert('error', gettext('Ende vor Start!'));
              } else {
                if($rootScope.projekt) {
                  if($rootScope.projekt.einsatzEinheit === EINSATZEINHEIT.STUNDEN) {
                    $scope.arbeitsangebot.einsatzZeit = Math.abs(diff/(1000*60*60));
                  } else if($rootScope.projekt.einsatzEinheit === EINSATZEINHEIT.HALBTAGE) {
                    $scope.arbeitsangebot.einsatzZeit = Math.abs(diff/(1000*60*60)/4);
                  } else if($rootScope.projekt.einsatzEinheit === EINSATZEINHEIT.TAGE) {
                    $scope.arbeitsangebot.einsatzZeit = Math.abs(diff/(1000*60*60)/8);
                  } else {
                    $scope.arbeitsangebot.einsatzZeit = 0;
                  }
                }
              }
          } else {
            $scope.arbeitsangebot.einsatzZeit = '';
          }

          // min max times
          $scope.tpOptionsVon.max = $scope.arbeitsangebot.zeitBis;
          $scope.tpOptionsBis.min = $scope.arbeitsangebot.zeitVon;
        }, true);
      };

      // destroy watcher
      $scope.$on('$destroy', function() {
        if($scope.unwatchMinMaxValues) {
          $scope.unwatchMinMaxValues();
        }
      });

      $scope.closeAddPerson = function() {
        $scope.displayAddPerson = undefined;
        $scope.addingPerson = undefined;
        $scope.newEinsatz = undefined;
      };

      $scope.closeAddPersonFunct = function() {
        return $scope.closeAddPerson;
      };

      $scope.einsatzActions = [{
        labelFunction: function() {
          return gettext('Person hinzufügen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-plus',
        onExecute: function() {
          $scope.displayAddPerson = true;
          $scope.newEinsatz = undefined;
          return true;
        },
        isDisabled: function() {
          return !$scope.arbeitsangebot.mehrPersonenOk && $scope.arbeitsangebot.anzahlPersonen <= $scope.sumPersonen();
        }
      }, {
        label: gettext('Personenliste anzeigen'),
        iconClass: 'fa fa-user',
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        },
        onExecute: function() {
          var result = lodash.filter($scope.checkboxes.data, function(d) {
            return lodash.includes($scope.checkboxes.ids, d.id);
          });
          result = lodash.map(result, 'personId');
          $location.path('/personen').search('q', 'id=' + result.join());
        }
      }];

      $scope.getPersonen = function(filter) {
        if ($scope.loading) {
          return;
        }

        $scope.loading = true;

        return PersonenOverviewModel.query({
          q: filter
        }, function() {
          $scope.loading = false;
        }).$promise.then(function(personen) {
          var filtered = $filter('filter')(personen, filter);
          console.log('Filtered: ', filtered, ' with filter ', filter);
          return filtered;
        });
      };

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            kurzzeichen: 'asc'
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          getData: function(params) {
            if (!$scope.arbeitseinsaetze) {
              return;
            }
            var orderedData = params.sorting ?
              $filter('orderBy')($scope.arbeitseinsaetze, params.orderBy(), false, localeSensitiveComparator) :
              $scope.arbeitseinsaetze;

            $scope.filteredEntries = orderedData;

            params.total(orderedData.length);
            return orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
          }

        });
      }

      $scope.selectPerson = function(person) {
        $scope.newEinsatz = {
          person: person,
          entity: {
            arbeitsangebotId: $scope.arbeitsangebot.id,
            arbeitsangebotTitel:  $scope.arbeitsangebot.titel,
            zeitVon: $scope.arbeitsangebot.zeitVon,
            zeitBis: $scope.arbeitsangebot.zeitBis,
            kundeId: person.kundeId,
            kundeBezeichnung: person.kundeBezeichnung,
            personId: person.id,
            personName: person.vorname + ' ' + person.name,
            anzahlPersonen: 1,
            einsatzZeit: $scope.arbeitsangebot.einsatzZeit
          }
        };
      };

      $scope.addPersonSave = function() {
        $scope.newEinsatzEntity = new ArbeitseinsaetzeDetailModel($scope.newEinsatz.entity);
        $scope.newEinsatzEntity.$save(function() {
          $scope.closeAddPerson();
        });
      };

      $scope.deleteArbeitseinsatz = function(einsatz) {
        einsatz.$delete();
      };

      $scope.sumPersonen = function() {
        if ($scope.arbeitseinsaetze) {
          return lodash.sumBy($scope.arbeitseinsaetze, 'anzahlPersonen');
        } else {
          return 0;
        }
      };

      if (!$routeParams.id || $routeParams.id === 'new') {
        $scope.arbeitsangebot = new ArbeitsangeboteDetailModel(defaults.model);
        $scope.watchMinMaxValues();
      } else {
        ArbeitsangeboteDetailModel.get({
          id: $routeParams.id
        }, function(result) {
          $scope.arbeitsangebot = result;
          if(angular.isUndefined($scope.arbeitseinsaetze)) {
              ArbeitseinsaetzeDetailModel.query({
                arbeitsangebotId:  $scope.arbeitsangebot.id
              }, function(data) {
                $scope.arbeitseinsaetze = data;
                $scope.tableParams.reload();
              });
          }
          $scope.arbeitsangebotForm.$setPristine();
          $scope.arbeitsangebotInit = true;
          $scope.watchMinMaxValues();
        });
      }

      $scope.aaFreischalten = function() {
        $scope.arbeitsangebot.status = ARBEITSEINSATZSTATUS.BEREIT;
        $scope.save();
      };

      $scope.aaZurueckziehen = function() {
        $scope.arbeitsangebot.status = ARBEITSEINSATZSTATUS.INVORBEREITUNG;
        $scope.save();
      };

      $scope.aaAbsagen = function() {
        $scope.arbeitsangebot.status = ARBEITSEINSATZSTATUS.ABGESAGT;
        $scope.save();
      };

      $scope.aaAbschliessen = function() {
        $scope.arbeitsangebot.status = ARBEITSEINSATZSTATUS.ARCHIVIERT;
        $scope.save();
      };

      $scope.duplicateArbeitsangebot = function(angebotDaten) {
        var newModel = {
          arbeitsangebotId: $scope.arbeitsangebot.id,
          daten: angebotDaten
        };
        $http.post(appConfig.get().API_URL +
          'arbeitsangebote/' + newModel.arbeitsangebotId + '/aktionen/duplizieren',
          newModel).then(function() {
          $scope.template.creating = $scope.template.creating +
            angebotDaten.length;
        });
      };

      $scope.aaMultiplizieren = function() {
        $scope.save();
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/arbeitsangebote/detail/duplicate/duplicate-arbeitsangebot.html',
          controller: 'ArbeitsangebotDuplicateController',
          resolve: {
            arbeitsangebot: function() {
              return $scope.arbeitsangebot;
            }
          }
        });

        modalInstance.result.then(function(daten) {
          //start date is already created. It needs to be removed from duplication
          lodash.remove(daten, function(date){
            return (date.getTime() === $scope.arbeitsangebot.zeitVon.getTime());
          })
          
          $scope.duplicateArbeitsangebot(daten);
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitsangebot') {
          if($scope.user.id === msg.data.modifikator) {
            alertService.addAlert('info', gettext(
              'Arbeitsangebot eingefügt'));
          }
        }
      });

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitseinsatz') {
          if($scope.user.id === msg.data.modifikator && $scope.arbeitseinsaetze) {
            $scope.arbeitseinsaetze.push(msg.data);
            $scope.$apply();
            $scope.tableParams.reload();
          }
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'Arbeitseinsatz') {
          if($scope.user.id === msg.data.modifikator) {
            angular.forEach($scope.arbeitseinsaetze, function(arbeitseinsats) {
              if (arbeitseinsats.id === msg.data.id && $scope.arbeitseinsaetze) {
                var index = $scope.arbeitseinsaetze.indexOf(
                  arbeitseinsats);
                if (index > -1) {
                  $scope.arbeitseinsaetze.splice(index, 1);
                }
              }
            });
            $scope.$apply();
            $scope.tableParams.reload();
          }
        }
      });
    }
  ]);
