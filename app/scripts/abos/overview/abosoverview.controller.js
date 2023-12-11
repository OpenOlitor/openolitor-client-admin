'use strict';

/**
 */
angular.module('openolitor-admin')
  .controller('AbosOverviewController', ['$scope', '$rootScope', '$filter', '$location',
    'AbosOverviewModel', 'KundenOverviewModel', 'NgTableParams', 'AbotypenOverviewModel',
    'FilterQueryUtil', 'OverviewCheckboxUtil', 'localeSensitiveComparator', 'EmailUtil', 'lodash',
    'PersonenOverviewModel', 'gettext', 'msgBus', 'DetailNavigationService', 'ABOTYPEN', 'EnumUtil', 'DepotsOverviewModel', 'TourenModel', 'VertriebeListModel',
    function($scope, $rootScope, $filter, $location, AbosOverviewModel, KundenOverviewModel, NgTableParams,
      AbotypenOverviewModel, FilterQueryUtil, OverviewCheckboxUtil, localeSensitiveComparator, EmailUtil, lodash,
      PersonenOverviewModel, gettext, msgBus, DetailNavigationService, ABOTYPEN, EnumUtil, DepotsOverviewModel, TourenModel, VertriebeListModel) {

      $scope.ABOTYPEN_ARRAY = EnumUtil.asArray(ABOTYPEN).map(function(typ) {
        return typ.id;
      });

      $rootScope.viewId = 'L-Abo';

      $scope.entries = [];
      $scope.filteredEntries = [];
      $scope.loading = false;
      $scope.selectedAbo = undefined;
      $scope.model = {};
      $scope.vertriebL = [];
      $scope.initGJ = false;
      $scope.displayedAbotypen  = [];

      $scope.navigateToKunde = function(id) {
          $scope.filteredEntries = [];
          var listKundeIds = []
          var currentKundeId = $filter('filter')($scope.entries,{kundeId:id},true)[0];

          angular.forEach($scope.checkboxes.ids, function(id){
              listKundeIds.push($scope.checkboxes.data[id].kundeId);
          });

          $scope.allEntries = KundenOverviewModel.query({
              f: $scope.search.filterQuery
          }, function() {
              $scope.loading = false;
              angular.forEach(listKundeIds, function(kundeId){
                  $scope.filteredEntries.push($filter('filter')($scope.allEntries,{id:kundeId},true)[0]);
              });
              DetailNavigationService.detailFromOverview(currentKundeId.kundeId, $scope, 'kunden', $location.url());
          });
      };

      $scope.search = {
        query: '',
        queryQuery: '',
        filterQuery: '',
        complexFlags: {
          zusatzAbosAktiv: true
        }
      };

      $scope.checkboxes = {
        checked: false,
        checkedAny: false,
        items: {},
        css: '',
        ids: []
      };

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.abotypL = [];
      AbotypenOverviewModel.query({
        q: ''
      }, function(list) {
        angular.forEach(list, function(abotyp) {
          $scope.abotypL.push({
            'id': abotyp.id,
            'title': abotyp.name,
            'price': abotyp.preis,
            'aktiv': abotyp.aktiv
          });
        });
      });

      $scope.updateChecked = function() {
        var activeCheckboxes = lodash.pickBy($scope.checkboxes.items, function(value, key) {
          return value;
        });
        $scope.aboIdsMailing = _($scope.entries)
          .keyBy('id')
          .at(Object.keys(activeCheckboxes))
          .map('id')
          .value();

        $scope.kundeIds = _($scope.entries)
          .keyBy('id')
          .at(Object.keys(activeCheckboxes))
          .map('kundeId')
          .value();
      };

      $scope.vertriebL = [];
      VertriebeListModel.getAllVertriebe({},function(entries) {
          angular.forEach(lodash.sortBy(entries,function(vl){
              return vl.beschrieb.toLowerCase();
          }), function(vertrieb) {
              $scope.vertriebL.push({
                  'id': vertrieb.id,
                  'title': lodash.find($scope.abotypL, {'id':vertrieb.abotypId}).title + ' / ' + vertrieb.beschrieb
              });
          });
      });

      $scope.depotTourL = [];
      DepotsOverviewModel.query({
          q: ''
      }, function(depotList) {
          TourenModel.query({
              q: ''
          }, function(tourList) {
              angular.forEach(tourList,function(tl){tl.name =  tl.beschreibung;});
              var depotTourList = depotList.concat(tourList);
              angular.forEach(lodash.sortBy(depotTourList, function(tl){
                  return tl.name.toLowerCase();
              }), function(item) {
                  $scope.depotTourL.push({
                      'id': item.id,
                      'title': item.name
                  });
              });
          });
      });

      $scope.tourL = [];
      TourenModel.query({
          q: ''
      }, function(tourList) {
          angular.forEach(lodash.sortBy(tourList, function(tl){
              return tl.name.toLowerCase();
          }), function(item) {
              $scope.tourL.push({
                  'id': item.id,
                  'title': item.name
              });
          });
      });

      // watch for check all checkbox
      $scope.$watch(function() {
        return $scope.checkboxes.checked;
      }, function(value) {
        OverviewCheckboxUtil.checkboxWatchCallback($scope, value);
        $scope.updateChecked();
      });

      // watch for data checkboxes
      $scope.$watch(function() {
        return $scope.checkboxes.items;
      }, function() {
        OverviewCheckboxUtil.dataCheckboxWatchCallback($scope);
      }, true);

      $scope.toggleShowAll = function() {
        $scope.showAll = !$scope.showAll;
        $scope.tableParams.reload();
      };

      $scope.selectAbo = function(abo, itemId) {
        var allRows = angular.element('#abosTable table tbody tr');
        allRows.removeClass('row-selected');

        if ($scope.selectedAbo === abo) {
          $scope.selectedAbo = undefined;
        } else {
          $scope.selectedAbo = abo;
          var row = angular.element('#' + itemId);
          row.addClass('row-selected');
        }
      };

      $scope.unselectAbo = function() {
        $scope.selectedAbo = undefined;
        var allRows = angular.element('#abosTable table tbody tr');
        allRows.removeClass('row-selected');
      };

      $scope.unselectAboFunct = function() {
        return $scope.unselectAbo;
      };

      if (!$scope.tableParams) {
        //use default tableParams
        $scope.tableParams = new NgTableParams({ // jshint ignore:line
          page: 1,
          count: 10,
          sorting: {
            id: 'asc'
          },
          filter: {
            abotypId: '',
            aktiv: true
          }
        }, {
          filterDelay: 0,
          groupOptions: {
            isExpanded: true
          },
          exportODSModel: AbosOverviewModel,
          exportODSFilter: function() {
            return {
              f: $scope.search.filterQuery,
              g: $scope.geschaeftsjahr,
              x: $scope.search.complexFlags
            };
          },
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            // use build-in angular filter
            var dataSet = $filter('filter')($scope.entries, $scope.search.queryQuery);
            // also filter by ngtable filters
            dataSet = $filter('filter')(dataSet, params.filter());
            dataSet = params.sorting ?
              $filter('orderBy')(dataSet, params.orderBy(), false, localeSensitiveComparator) :
              dataSet;

            // Add sortby attribute for ng-table. (ng-table can't sort on the result of a function)
            for(var i = 0; i < dataSet.length; i++) {
              var abo = dataSet[i];
              if(abo.depotId) {
                abo.depotTourSortBy = abo.depotName;
              } else {
                abo.depotTourSortBy = abo.tourName;
              }
            }

            $scope.filteredEntries = dataSet;
            updateIds();
            $scope.displayedAbotypen.length = 0;
            angular.forEach(fillFilter(params.filter().aktiv), function(abotyp) {
              $scope.displayedAbotypen.push(abotyp);
            });
            params.total(dataSet.length);

            $location.search({
              'q': $scope.search.query,
              'g': $scope.geschaeftsjahr,
              'f': JSON.stringify($scope.search.complexFlags),
              'tf': JSON.stringify($scope.tableParams.filter())});

            return dataSet.slice((params.page() - 1) * params.count(),
              params.page() * params.count());
          }

        });

        var existingFilter = $location.search().tf;
        if (existingFilter) {
          $scope.tableParams.filter(JSON.parse(existingFilter));
        }
      }

      function fillFilter(aktiv) {
        var da = [];
        angular.forEach($scope.abotypL, function(abotyp) {
          if ( aktiv === true && abotyp.aktiv === true){
            da.push({'id':abotyp.id, 'title':abotyp.title});
          } else if (aktiv !== true ) {
            da.push({'id':abotyp.id, 'title':abotyp.title});
          }
        });
        return da;
      }

      function updateIds() {
            var ids = [];
            var checkedItems = [];
            var items = [];
            angular.forEach($scope.checkboxes.checkedItems, function(i){
              ids.push(i.id);
              checkedItems.push(i);
              items.push([i.id,true]);
            })

            $scope.checkboxes.ids = ids;
            $scope.checkboxes.checkedItems = checkedItems;
            $scope.checkboxes.items = Object.fromEntries(items);
            $scope.updateChecked();
      }

      $scope.selectedGeschaeftsjahr = function(gj) {
        if(angular.isDefined(gj)) {
          $scope.geschaeftsjahr = gj;
        } else {
          $scope.geschaeftsjahr = undefined;
        }
        $scope.initGJ = true;
        search();
        return false;
      }

      $scope.actions = [{
        labelFunction: function() {
          return gettext('Rechnungspositionen erstellen');
        },
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          $scope.showCreateRechnungenDialog = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('E-Mail versenden'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-envelope',
        onExecute: function() {
          PersonenOverviewModel.query({
            f: 'kundeId=' + $scope.kundeIds + ';'
          }, function(personen) {
            var emailAddresses = _(personen)
              .map('email')
              .value();

            EmailUtil.toMailToBccLink(emailAddresses);
            return true;
          });
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }, {
        label: gettext('E-Mail Formular'),
        noEntityText: true,
        iconClass: 'glyphicon glyphicon-pencil',
        onExecute: function() {
          $scope.$broadcast("resetDirectiveEmailDialog");
          $scope.entity = gettext('abo');
          $scope.url = 'mailing/sendEmailToAbosSubscribers';
          $scope.message = gettext('Wenn Sie folgende Label einfügen, werden sie durch den entsprechenden Wert ersetzt: \n {{person.anrede}} \n {{person.vorname}} \n {{person.name}} \n {{person.rolle}} \n {{person.kundeId}} \n {{abo.abotypName}} \n {{abo.kunde}} \n {{abo.start}} \n {{abo.ende}}');
          $scope.showCreateEMailDialog = true;
          return true;
        },
        isDisabled: function() {
          return !$scope.checkboxes.checkedAny;
        }
      }];

      function search() {
        if ($scope.loading || !$scope.initGJ) {
          return;
        }
        $scope.loading = true;

        AbosOverviewModel.query({
          f: $scope.search.filterQuery,
          q: $scope.search.queryQuery,
          x: $scope.search.complexFlags,
          g: /^\d+$/.test($scope.geschaeftsjahr)?$scope.geschaeftsjahr:'',
        }, function(entries) {
          $scope.entries = [];
          angular.forEach(entries, function(entry){
            if (!entry.depotId){
              entry.depotTourId = entry.tourId;
            }
            if (!entry.tourId){
              entry.depotTourId = entry.depotId;
            }
            if (!entry.price){
              entry.price = $scope.abotypL.find(x => x.id === entry.abotypId).price;
            }
            $scope.entries.push(entry);
          });
          $scope.tableParams.reload();
          $scope.loading = false;
        });
      }

      var existingGJ = $location.search().g;
      if (existingGJ) {
        $scope.geschaeftsjahr = existingGJ;
      }

      var existingQuery = $location.search().q;
      if (existingQuery) {
        $scope.search.query = existingQuery;
      }


      var existingFilterQuery = $location.search().f;
      if (existingFilterQuery) {
        $scope.search.complexFlags = JSON.parse(existingFilterQuery);
      }

      $scope.closeCreateRechnungenDialog = function() {
        $scope.showCreateRechnungenDialog = false;
      };

      $scope.closeCreateRechnungenDialogFunct = function() {
        return $scope.closeCreateRechnungenDialog;
      };

      $scope.closeCreateEMailDialog = function() {
        $scope.showCreateEMailDialog = false;
      };

      $scope.closeCreateEMailDialogFunct = function() {
        return $scope.closeCreateEMailDialog;
      };

      $scope.$watchGroup(['search.query', 'search.complexFlags.zusatzAbosAktiv'], function() {
        $scope.search.filterQuery = FilterQueryUtil.transform($scope.search
          .query);
        $scope.search.queryQuery = FilterQueryUtil.withoutFilters($scope.search
          .query);
        search();
      }, true);

      var isAboEntity = function(entity) {
        return $scope.ABOTYPEN_ARRAY.indexOf(entity) > -1;
      };

      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (msg.entity.indexOf('Abo') >= 0) {
          $scope.entries.map(function(entry) {
            if(entry.id === msg.data.id) {
              angular.copy(msg.data, entry);
            }
          });
          $scope.$apply();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (isAboEntity(msg.entity)) {
          _.remove($scope.entries, function(entry) {
            return entry.id === msg.data.id;
          });
          $scope.tableParams.reload();
          if($scope.selectedAbo.id === msg.data.id) {
            $scope.unselectAbo();
          }
        }
      });
    }
  ]);
