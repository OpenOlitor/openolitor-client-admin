'use strict';

/**
 */
angular.module('openolitor-admin')
  .factory('ReportvorlagenService', ['$rootScope', 'ReportvorlagenModel', 'msgBus', 'lodash',
  'DataUtil',
    function($rootScope, ReportvorlagenModel, msgBus, lodash, DataUtil) {

      var vorlagen;

      var load = function() {
        ReportvorlagenModel.query({}, function(result) {
          vorlagen = lodash.groupBy(result, 'typ');
        });
      };
      load();

      msgBus.onMsg('EntityCreated', $rootScope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage') {
          var newModel = new ReportvorlagenModel(msg.data);
          if (!vorlagen[msg.data.typ]) {
            vorlagen[msg.data.typ] = [];
          }
          vorlagen[msg.data.typ].push(newModel);
          var newMsg = {
            type: 'ProjektVorlageCreated',
            vorlage: newModel
          };
          msgBus.emitMsg(newMsg);
          $rootScope.$apply();
        }
      });

      msgBus.onMsg('EntityModified', $rootScope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage') {
          var vorlage = lodash.find(vorlagen[msg.data.typ], function(r) {
            return r.id === msg.data.id;
          });
          if (vorlage) {
            DataUtil.update(msg.data, vorlage);
            var newMsg = {
              type: 'ProjektVorlageModified',
              vorlage: vorlage
            };
            msgBus.emitMsg(newMsg);
            $rootScope.$apply();
          }
        }
      });

      msgBus.onMsg('EntityDeleted', $rootScope, function(event, msg) {
        if (msg.entity === 'ProjektVorlage') {
          var index = lodash.findIndex(vorlagen[msg.data.typ], function(vorlage) {
            return vorlage.id === msg.data.id;
          });
          if (index >= 0) {
            var vorlage = vorlagen[msg.data.typ][index];
            vorlagen[msg.data.typ].splice(index, 1);
            var newMsg = {
              type: 'ProjektVorlageDeleted',
              vorlage: vorlage
            };
            msgBus.emitMsg(newMsg);
            $rootScope.$apply();
          }
        }
      });

      return {
        getVorlagen: function(typ) {
          if (vorlagen) {
            return vorlagen[typ];
          }
          else {
            return undefined;
          }
        }
      };
    }
  ]);
