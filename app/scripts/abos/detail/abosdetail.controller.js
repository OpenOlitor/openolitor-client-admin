'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AbosDetailController', ['$scope', '$filter', '$routeParams',
    '$location', '$route', '$uibModal', '$log', '$http', 'gettext',
    'AbosDetailModel','ZusatzAbotypenModel', 'ZusatzAboModel','AbotypenOverviewModel',
    'AbotypenDetailModel', 'KundenDetailModel', 'VertriebeListModel',
    'VERTRIEBSARTEN', 'AboKoerbeModel',
    'ABOTYPEN', 'moment', 'EnumUtil', 'DataUtil', 'msgBus', '$q', 'lodash',
    'API_URL', 'alertService', 'NgTableParams',

    function($scope, $filter, $routeParams, $location, $route, $uibModal, $log, $http, gettext,
      AbosDetailModel, ZusatzAbotypenModel, ZusatzAboModel, AbotypenOverviewModel, AbotypenDetailModel,
      KundenDetailModel, VertriebeListModel, VERTRIEBSARTEN, AboKoerbeModel,
      ABOTYPEN, moment, EnumUtil, DataUtil, msgBus, $q, lodash, API_URL,
      alertService, NgTableParams) {

      $scope.VERTRIEBSARTEN = VERTRIEBSARTEN;
      $scope.ABOTYPEN_ARRAY = EnumUtil.asArray(ABOTYPEN).map(function(typ) {
        return typ.id;
      });

      var defaults = {
        model: {
          id: undefined,
          abotypId: undefined
        }
      };

      var zusatzAbotypDefaults = {
        model: {
          id: undefined,
          name: undefined
        }
      };

      $scope.open = {
        start: false
      };

      $scope.openZusatzAbo = {
        start: [],
        ende: []
      };

      $scope.lists = {
        vertriebe: {},
        vertriebsarten: {}
      };

      $scope.openCalendar = function(e,date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.open[date] = true;
      };

      $scope.openCalendarZusatzAbo = function(e,id,date) {
        e.preventDefault();
        e.stopPropagation();

        $scope.openZusatzAbo[date][id] = true;
      };

      var getKundeId = function() {
        if (angular.isDefined($routeParams.kundeId)) {
          return $routeParams.kundeId;
        } else {
          return $scope.kundeId;
        }
      };

      var getAboId = function() {
        if (angular.isDefined($scope.aboId)) {
          return $scope.aboId;
        } else {
          return $scope.id;
        }
      };

      var loadZusatzAbotypen = function() {
        ZusatzAbotypenModel.query({},
            function(result){
               $scope.zusatzAboTyp = result;
        });
      };

      var loadZusatzAbos = function() {
         ZusatzAboModel.query({
           hauptAboId: getAboId(),
           kundeId:getKundeId()
         },function(zusatzAbos){
           $scope.zusatzAbos = zusatzAbos;
           $scope.zusatzAbos.forEach(function(zusatzAbo){
               if (zusatzAbo.price){
                  zusatzAbo.price = $scope.getZusatzabotypPrice($scope.zusatzAbo.abotypId);
               }
           });
         });
       };

       var createNewZusatzAbo = function(zusatzAbotyp) {
         var zusatzAbo = new ZusatzAboModel({hauptAboId: getAboId(), kundeId:getKundeId(),abotypId:zusatzAbotyp.id});
           zusatzAbo.$save();
       };

      var loadAboDetail = function() {
        if ($scope.loading === getAboId()) {
          return;
        }
        $scope.loading = getAboId();
        loadZusatzAbotypen();
        loadZusatzAbos();
        AbosDetailModel.get({
          id: getAboId(),
          kundeId: getKundeId()
        }, function(result) {
          $scope.abo = result;
          $scope.loading = false;
          if (!$scope.kunde || $scope.kunde.id !== $scope.abo.kundeId) {
            KundenDetailModel.get({
              id: $scope.abo.kundeId
            }, function(kunde) {
              $scope.kunde = kunde;
            });
          }

          $scope.lieferungen = AboKoerbeModel.query({
            kundeId: $scope.abo.kundeId,
            id: $scope.abo.id
          }, function() {
            $scope.koerbeTableParams.reload();
          });
        });
      };


      var unwatchAboId = $scope.$watch('aboId', function(id) {
        if (id && (!$scope.abo || $scope.abo.id !== id)) {
          loadAboDetail();
        }
      });

      $scope.init = function() {

        $scope.basePath = '/abos';
        if ($routeParams.kundeId) {
          $scope.basePath = '/kunden/' + $routeParams.kundeId;
        }

        if (!angular.isDefined(getAboId())) {
          KundenDetailModel.get({
            id: getKundeId()
          }, function(kunde) {
            $scope.kunde = kunde;
            $scope.abo = new AbosDetailModel(defaults.model);
            $scope.zusatzAbos = new AbosDetailModel(defaults.model);
            $scope.abo.kundeId = $scope.kunde.id;
            $scope.abo.kunde = $scope.kunde.bezeichnung;
            $scope.abo.start = moment().startOf('day').toDate();
            $scope.zusatzAboTyp = new ZusatzAbotypenModel(zusatzAbotypDefaults.model);
          });
        } else {
          if (!$scope.abo) {
            loadAboDetail();
          }
        }
      };

      $scope.init();

      $scope.lists.abotypen = AbotypenOverviewModel.query({
        aktiv: true
      });

      $scope.isExisting = function() {
        return angular.isDefined($scope.abo) && angular.isDefined($scope.abo
          .id);
      };

      $scope.cancel = function() {
        $location.path($scope.basePath);
      };

      $scope.delete = function() {
        return $scope.abo.$delete();
      };

      $scope.newZusatzAbo = function(id){
        createNewZusatzAbo(id);
        return(true);
      };

      $scope.deleteZusatzAbo = function(zusatzAbo){
        zusatzAbo.$delete();
      };

      var showGuthabenAnpassenDialog = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/abos/detail/abosdetail-guthaben-anpassen.html',
          controller: 'GuthabenAnpassenController',
          resolve: {
            abo: function() {
              return $scope.abo;
            }
          }
        });

        modalInstance.result.then(function(data) {
          $http.post(API_URL + 'kunden/' + $scope.abo.kundeId +
            '/abos/' + $scope.abo.id + '/aktionen/guthabenanpassen',
            data).then(function() {
            alertService.addAlert('info', gettext(
              'Guthaben wurde erfolgreich angepasst'));
          });
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      var showChangePriceDialog = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/abos/detail/abosdetail-price-anpassen.html',
          controller: 'PriceAnpassenController',
          resolve: {
            abo: function() {
              return $scope.abo;
            }
          }
        });

        modalInstance.result.then(function(data) {
          $http.post(API_URL + 'kunden/' + $scope.abo.kundeId +
            '/abos/' + $scope.abo.id + '/aktionen/priceanpassen',
            data).then(function() {
              alertService.addAlert('info', gettext(
                'Preis wurde erfolgreich angepasst'));
            });
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      var showVertriebsartAnpassenDialog = function() {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/abos/detail/abosdetail-vertriebsart-anpassen.html',
          controller: 'VertriebsartAnpassenController',
          resolve: {
            abo: function() {
              return $scope.abo;
            }
          }
        });

        modalInstance.result.then(function(data) {
          $http.post(API_URL + 'kunden/' + $scope.abo.kundeId +
            '/abos/' + $scope.abo.id +
            '/aktionen/vertriebsartanpassen', data).then(function() {
            alertService.addAlert('info', gettext(
              'Vertriebsart wurde erfolgreich angepasst'));
          });
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      if (!$scope.koerbeTableParams) {
        //use default tableParams
        $scope.koerbeTableParams = new NgTableParams({ // jshint ignore:line
          counts: []
        }, {
          getData: function(params) {
            if (!$scope.lieferungen) {
              return;
            }
            params.total($scope.lieferungen.length);
            return $scope.lieferungen;
          }

        });
      }

      $scope.zusatzAboActions = [{
        label: gettext('Speichern'),
        noEntityText: true,
        onExecute: function(zusatzabo) {
          return zusatzabo.$save();
        }
      }, {
        label: gettext('Löschen'),
        iconClass: 'glyphicon glyphicon-remove',
        noEntityText: true,
        isDisabled: function(zusatzabo) {
          return !zusatzabo || zusatzabo.anzahlLieferungen.length > 0 ||
            !lodash.every(zusatzabo.anzahlAbwesenheiten, {value: 0});
        },
        onExecute: function(zusatzabo) {
          return zusatzabo.$delete();
        }
      },{
        label: gettext('Rechnung manuell erstellen'),
        noEntityText: true,
        iconClass: 'fa fa-envelope-o',
        onExecute: function(zusatzabo) {
          return $q.when($location.path('kunden/' + getKundeId() +
            '/abos/' + zusatzabo.id + '/rechnungen/new'));
        }
      }];

      $scope.actions = [{
        label: gettext('Speichern'),
        noEntityText: true,
        onExecute: function() {
          return $scope.save();
        }
      }, {
        label: gettext('Löschen'),
        iconClass: 'glyphicon glyphicon-remove',
        noEntityText: true,
        isDisabled: function() {
          return !$scope.abo || $scope.abo.guthaben > 0 || $scope.abo
            .anzahlLieferungen.length > 0 ||
            !lodash.every($scope.abo.anzahlAbwesenheiten, {value: 0});
        },
        onExecute: function() {
          return $scope.abo.$delete();
        }
      }, {
        label: gettext('Guthaben anpassen'),
        noEntityText: true,
        iconClass: 'fa fa-balance-scale',
        onExecute: function() {
          showGuthabenAnpassenDialog();
        }
      }, {
        label: gettext('Vetriebsart anpassen'),
        noEntityText: true,
        iconClass: 'fa fa-truck',
        onExecute: function() {
          showVertriebsartAnpassenDialog();
        },
        isDisabled: function() {
          return !$scope.abo || !$scope.lists.vertriebsarten[$scope.abo
              .vertriebId] ||
            ($scope.lists.vertriebe[$scope.abo.abotypId].length < 2 &&
              $scope.lists.vertriebsarten[$scope.abo.vertriebId].length <
              2);
        }
      }, {
        label: gettext('Price anpassen'),
        noEntityText: true,
        iconClass: 'fa fa-balance-scale',
        onExecute: function() {
          showChangePriceDialog();
        }
      }, {
        label: gettext('Manuelle Rechnung erstellen'),
        noEntityText: true,
        iconClass: 'fa fa-envelope-o',
        onExecute: function() {
          return $q.when($location.path('kunden/' + getKundeId() +
            '/abos/' + getAboId() + '/rechnungen/new'));
        }
      }];

      $scope.save = function() {
        if(angular.isUndefined($scope.abo.ende) || $scope.abo.ende === null || $scope.abo.ende === '' || $scope.abo.start <= $scope.abo.ende) {
          return $scope.abo.$save();
        } else {
          alertService.addAlert('error', gettext(
            'Enddatum muss vor Startdatum liegen'));
          return '';
        }
      };

      $scope.saveZusatzAbo = function(zusatzAbo) {
        if(angular.isUndefined(zusatzAbo.ende) || zusatzAbo.ende === null || zusatzAbo.ende === '' || zusatzAbo.start <= zusatzAbo.ende) {
          return zusatzAbo.$save();
        } else {
          alertService.addAlert('error', gettext(
            'Enddatum muss vor Startdatum liegen'));
          return '';
        }
      };

      function createPermutations(abotyp) {
        VertriebeListModel.query({
          abotypId: abotyp.id
        }, function(vertriebe) {
          $scope.lists.vertriebe[abotyp.id] = [];
          lodash.forEach(vertriebe, function(
            vertrieb) {

            var v = {
              id: vertrieb.id,
              label: vertrieb.id + ': ' + (vertrieb.beschrieb ? vertrieb.beschrieb + ' - ' : '') +
                vertrieb.liefertag,
              vertrieb: vertrieb
            };
            $scope.lists.vertriebe[abotyp.id].push(v);
            $scope.lists.vertriebsarten[v.id] = [];

            lodash.forEach(vertrieb.depotlieferungen, function(
              lieferung) {
              lieferung.typ = VERTRIEBSARTEN.DEPOTLIEFERUNG;
              $scope.lists.vertriebsarten[v.id].push({
                id: lieferung.id,
                label: VERTRIEBSARTEN.DEPOTLIEFERUNG +
                  ' - ' +
                  lieferung.depot.name,
                vertriebsart: lieferung
              });
            });

            lodash.forEach(vertrieb.heimlieferungen, function(
              lieferung) {
              lieferung.typ = VERTRIEBSARTEN.HEIMLIEFERUNG;
              $scope.lists.vertriebsarten[v.id].push({
                id: lieferung.id,
                label: VERTRIEBSARTEN.HEIMLIEFERUNG +
                  ' - ' +
                  lieferung.tour.name,
                vertriebsart: lieferung
              });
            });

            lodash.forEach(vertrieb.postlieferungen, function(
              lieferung) {
              lieferung.typ = VERTRIEBSARTEN.POSTLIEFERUNG;
              $scope.lists.vertriebsarten[v.id].push({
                id: lieferung.id,
                label: VERTRIEBSARTEN.POSTLIEFERUNG,
                vertriebsart: lieferung
              });
            });
          });
        });
      }

      var unwatchAbotypId = $scope.$watch('abo.abotypId', function(abotypId) {
        if (abotypId) {
          AbotypenDetailModel.get({
            id: abotypId
          }, function(abotyp) {
            $scope.abotyp = abotyp;
            $scope.abo.abotypName = abotyp.name;
            createPermutations($scope.abotyp);
          });
        }
      });

      var unwatchVetriebsartId = $scope.$watch('abo.vertriebsart', function(
        vertriebsart) {
        if (vertriebsart) {
          $scope.abo.vertriebsartId = vertriebsart.id;
          switch (vertriebsart.typ) {
            case VERTRIEBSARTEN.DEPOTLIEFERUNG:
              $scope.abo.depotId = vertriebsart.depot.id;
              $scope.abo.depotName = vertriebsart.depot.name;
              delete $scope.abo.tourId;
              delete $scope.abo.tourName;
              break;
            case VERTRIEBSARTEN.HEIMLIEFERUNG:
              $scope.abo.tourId = vertriebsart.tour.id;
              $scope.abo.tourName = vertriebsart.tour.name;
              delete $scope.abo.depotId;
              delete $scope.abo.depotName;
              break;
            case VERTRIEBSARTEN.POSTLIEFERUNG:
              delete $scope.abo.tourId;
              delete $scope.abo.tourName;
              delete $scope.abo.depotId;
              delete $scope.abo.depotName;
              break;
          }
        }
      });

      $scope.aboGuthaben = function(abo) {
        if (!abo) {
          return;
        }
        return (abo.guthaben + abo.guthabenInRechnung);
      };

      $scope.aboPrice = function(abo) {
        if (!abo) {
          return
        }
        else {
            if (!abo.price){
                return (abo.abotyp.preis + " " + gettext(' (default price for ') + abo.abotyp.name + ')');
            } else {
                return (abo.price);
            }
        }
      }

      $scope.getZusatzabotypPrice = function(id) {
        var zusatzaboTypPrice;
        if (!$scope.zusatzAboTyp)  {
            return ;
        } else {
            $scope.zusatzAboTyp.forEach(function(za) {
                if (za.id === id) {
                    zusatzaboTypPrice = za.preis;
                }
            });
            return zusatzaboTypPrice;
        }
      }

      $scope.zusatzaboPrice = function(zusatzabo) {
        if (!zusatzabo) {
          return
        }
        else {
            if (!zusatzabo.price){
                return ($scope.getZusatzabotypPrice(zusatzabo.abotypId) + " " + gettext(' (default price for ') + zusatzabo.abotypName + ')');
            } else {
                return (zusatzabo.price);
            }
        }
      }
      $scope.guthabenTooltip = function(abo) {
        var vertrag = '';
        if (abo.guthabenVertraglich) {
          vertrag = '<b>' + gettext('Vertraglich') + ':</b> ' + abo.guthabenVertraglich +
            '<br />';
        }
        return '<b>' + gettext('Aktuell') + ':</b> <br />' + abo.guthaben + ' ' +
          gettext('bezahlt') + ' <br />+ ' + abo.guthabenInRechnung +
          ' ' + gettext('verrechnet') + ' <br />= ' + $scope.aboGuthaben(abo) +
          ' ' + gettext('total');
      };

      $scope.vertriebsart = function() {
        if (!$scope.abo) {
          return;
        }
        if ($scope.abo.depotId) {
          return gettext(VERTRIEBSARTEN.DEPOTLIEFERUNG);
        } else if ($scope.abo.tourId) {
          return gettext(VERTRIEBSARTEN.HEIMLIEFERUNG);
        } else {
          return gettext(VERTRIEBSARTEN.POSTLIEFERUNG);
        }
      };

      $scope.guthabenClass = function(abo) {
        if (abo && abo.abotyp && ($scope.aboGuthaben(abo) < abo.abotyp.guthabenMindestbestand)) {
          return 'error';
        } else if (abo && ($scope.aboGuthaben(abo) < 0)) {
          return 'warning';
        } else {
          return '';
        }
      };

      $scope.priceClass = function(abo) {
        if (abo && abo.abotyp && ($scope.abo.price < 0)) {
          return 'error';
        } else if (abo && ($scope.abo.price < abo.abotyp.price)) {
          return 'warning';
        } else {
          return '';
        }
      };

      $scope.kuendigungstermin = function(abo) {
        var einheit = (abo.abotyp.vertragslaufzeit.einheit === 'Wochen') ?
          'w' : 'M';
        var now = moment();
        var laufzeit = moment(abo.start);
        do {
          laufzeit = laufzeit.add(abo.abotyp.vertragslaufzeit.wert - 1, einheit);
        } while (laufzeit.isBefore(now));
        return laufzeit.endOf(einheit).toDate();
      };

      $scope.kuendigungsfrist = function(abo) {
        var termin = $scope.kuendigungstermin(abo);
        var einheit = (abo.abotyp.kuendigungsfrist.einheit === 'Wochen') ?
          'w' : 'M';
        return moment(termin).subtract(abo.abotyp.kuendigungsfrist.wert,
          einheit).toDate();
      };

      $scope.$on('destroy', function() {
        unwatchAboId();
        unwatchAbotypId();
        unwatchVetriebsartId();
      });

      var isAboEntity = function(entity) {
        return $scope.ABOTYPEN_ARRAY.indexOf(entity) > -1;
      };

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          if ($scope.abo && $scope.abo.id === msg.data.id) {
            DataUtil.update(msg.data, $scope.abo);

            loadAboDetail();

            $scope.$apply();
            return;
          }
        }
      });

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if ((msg.entity) === 'ZusatzAbo') {
            $scope.zusatzAbos.push(new ZusatzAboModel(msg.data));
            $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if ((msg.entity) === 'ZusatzAbo') {
            $scope.zusatzAbos.splice($scope.zusatzAbos.indexOf(event.data),1);
            $scope.$apply();
        }
      });

      // list to created event as well. when changing vertriebsart entity might get recreated
      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          if ($scope.abo && $scope.abo.id === msg.data.id) {
            $route.reload();
            $scope.$apply();
            return;
          }
        }
      });
    }
  ]);
