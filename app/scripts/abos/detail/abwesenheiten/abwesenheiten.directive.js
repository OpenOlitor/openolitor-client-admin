'use strict';

angular.module('openolitor-admin').directive('ooAboAbwesenheiten', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/detail/abwesenheiten/abwesenheiten.html',
      controller: function(
        $scope,
        $rootScope,
        NgTableParams,
        AbwesenheitenListModel,
        msgBus,
        lodash,
        GeschaeftsjahrUtil
      ) {
        $scope.currentlyMatchingGJItem = undefined;
        $scope.templateObject = {};
        $scope.templateObject.showOnlyPending = true;
        $scope.isInCurrentOrLaterGJ = false;
        $scope.deletingAbwesenheit = {};
        $scope.date = new Date();
        $scope.template = {
          creating: 0
        };

        $scope.filterIfLieferungOpenOrNeedsToBeChecked = function(item) {
          if ($scope.isLieferungOpen(item)) {return item;}
          else if (item.bemerkung) {return item;}
          else {return '';}
        };

        $scope.abwesenheitsDaten = function() {
          if (!$scope.abwesenheiten) {
            return [];
          }
          return $scope.abwesenheiten.map(function(i) {
            return i.lieferungId;
          });
        };

        $scope.deletingAbwesenheit = function(abw) {
          return $scope.deletingAbwesenheit[abw.id];
        };

        $scope.deleteAbwesenheit = function(abw) {
          $scope.deletingAbwesenheit[abw.id] = true;
          abw.$delete();
        };

        $scope.addAbwesenheit = function(lieferung) {
          var newModel = new AbwesenheitenListModel({
            datum: lieferung.datum,
            lieferungId: lieferung.id,
            aboId: $scope.abo.id,
            kundeId: $scope.abo.kundeId
          });
          newModel.$save();
          $scope.template.creating = $scope.template.creating + 1;
        };

        $scope.isLieferungOpen = function(abw) {
          var lieferung = lodash.filter($scope.abo.lieferdaten, function(l) {
            return l.id === abw.lieferungId;
          });
          return (
            lieferung && lieferung.length === 1 && (!lieferung[0].lieferplanungId || lieferung[0].status === 'Offen')
          );
        };

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
        };

        var unwatchRoot = $rootScope.$watch('projekt', function(projekt) {
          if(projekt) {
            $scope.isInCurrentOrLaterGJ = GeschaeftsjahrUtil.isInCurrentOrLaterGJ(projekt,new Date());
          }
        });

        $scope.getCurrentAbsences = function() {
          return ($scope.isInCurrentOrLaterGJ && !angular.isUndefined($scope.currentlyMatchingGJItem) && !angular.isUndefined($scope.currentlyMatchingGJItem.value)) ? $scope.currentlyMatchingGJItem.value : 0;
        };

        function updateGJValues() {
          $scope.currentlyMatchingGJItem = GeschaeftsjahrUtil.getMatchingGJItem($scope.abo.anzahlAbwesenheiten, $rootScope.projekt);
          $scope.isInCurrentOrLaterGJ = GeschaeftsjahrUtil.isInCurrentOrLaterGJ;
          var dateArray = String($scope.currentlyMatchingGJItem.key).split('/');
          var date = new Date();
          if (typeof $scope.currentlyMatchingGJItem.key !== 'number') {
            var dateArray = $scope.currentlyMatchingGJItem.key.split('/');
            date.setYear(dateArray[1]);
            date.setMonth(dateArray[0], 1);
          } else {
            date.setYear($scope.currentlyMatchingGJItem.key);
            date.setMonth(1, 1);
          }
        }

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo && !angular.isUndefined($scope.abo.abwesenheiten)) {
            $scope.abwesenheiten = $scope.abo.abwesenheiten.map(function(abw) {
              abw.kundeId = $scope.abo.kundeId;
              return new AbwesenheitenListModel(abw);
            });
            updateGJValues();
            if ($scope.abwesenheitenTableParams) {
              $scope.abwesenheitenTableParams.reload();
            }
          }
        });

        var unwatchCollection = $scope.$watchCollection(
          'abo.anzahlAbwesenheiten',
          function(newAbwesenheiten) {
            if (newAbwesenheiten) {
              updateGJValues();
            }
          }
        );

        if (!$scope.abwesenheitenTableParams) {
          //use default tableParams
          $scope.abwesenheitenTableParams = new NgTableParams(
            {
              // jshint ignore:line
              counts: [],
              sorting: {
                datum: 'asc'
              }
            },
            {
              getData: function(params) {
                if (!$scope.abwesenheiten) {
                  return;
                }
                params.total($scope.abwesenheiten.length);
                return $scope.abwesenheiten;
              }
            }
          );
        }

        $scope.getAbwesenheitenTooltip = function(abo) {
          var ret = '';
          angular.forEach(abo.anzahlAbwesenheiten, function(gj) {
            ret += gj.key + ': ' + gj.value + '<br />';
          });

          return ret;
        };

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.template.creating = $scope.template.creating - 1;
            msg.data.kundeId = $scope.abo.kundeId;
            $scope.abwesenheiten.push(new AbwesenheitenListModel(msg.data));

            $scope.$apply();
          }
        });

        msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.deletingAbwesenheit[msg.data.id] = undefined;

            angular.forEach($scope.abwesenheiten, function(abw) {
              if (abw.id === msg.data.id) {
                var index = $scope.abwesenheiten.indexOf(abw);
                if (index > -1) {
                  $scope.abwesenheiten.splice(index, 1);
                }
              }
            });

            $scope.$apply();
          }
        });
        $scope.$on('destroy', function() {
          unwatch();
          unwatchCollection();
          unwatchRoot();
        });
      }
    };
  }
]);
