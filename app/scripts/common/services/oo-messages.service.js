'use strict';

angular.module('openolitor')
  .factory('ooClientMessageService', ['$http', '$location', '$q', '$rootScope',
    'msgBus', 'API_WS_URL', 'BUILD_NR',
    function($http, $location, $q, $rootScope, msgBus, API_WS_URL, BUILD_NR) {

      var send = function(eventType, eventData) {
        //append type to event data
        var obj = JSON.stringify(eventData);
        var event = '{"type":"' + eventType + '",' + obj.substring(1);
        try {
          console.log('sending message: ' + event);
          $rootScope.messagingSocket.send(event);
        } catch (err) {
          console.log('error sending message: i' + err);
        }
      };

      return {
        //send message to server
        send: send,
        //start websocket based messaging
        start: function() {
          console.log('registering websocket, request websocket url');
          var wsUrl = API_WS_URL.replace('http://', 'ws://');
          console.log('registering websocket, bind to '+wsUrl);
          //append token to websocket url because normal http headers can't get controlled
          var securedUrl = wsUrl; //+ "?auth="+userService.getToken();
          if (!(angular.isDefined($rootScope.messagingSocket))) {
            $rootScope.messagingSocket = new WebSocket(securedUrl);
            $rootScope.messagingSocket.onmessage = function(msg) {
              var data = convertDateStringsToDates(JSON.parse(msg.data));
              console.log('received event');
              console.log(data);
              msgBus.emitMsg(data);
            };
            $rootScope.messagingSocket.onopen = function(event) {
              console.log('onopen : ' + event);
              //send hello command to server
              send('HelloServer', {
                client: 'angularClient_' + BUILD_NR
              });
            };
          }
        }
      };
    }
  ]);
