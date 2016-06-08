'use strict';

angular.module('openolitor')
  .factory('ooClientMessageService', ['$http', '$location', '$q', '$interval',
    '$rootScope', '$log',
    'msgBus', 'API_WS_URL', 'BUILD_NR', 'ooAuthService',
    function($http, $location, $q, $interval, $rootScope, $log, msgBus,
      API_WS_URL, BUILD_NR, ooAuthService) {

      var send = function(eventType, eventData) {
        // append type to event data
        var obj = JSON.stringify(eventData);
        var data = (obj) ? (',' + obj.substring(1)) : '';
        var event = '{"type":"' + eventType + '"' + data + '}';
        try {
          $log.debug('sending message: ' + event);
          $rootScope.messagingSocket.send(event);
        } catch (err) {
          $log.error('error sending message: i' + err);
        }
      };

      var reconnectPromise;
      var scheduler;

      var openWebSocket = function(url) {
        var ws = new WebSocket(url);

        ws.onmessage = function(msg) {
          var data = convertDateStringsToDates(JSON.parse(msg.data));
          console.log('WS received event');
          console.log(data);
          msgBus.emitMsg(data);
        };
        ws.onopen = function(event) {
          console.log('WS onopen : ' + event);
          //send hello command to server
          send('HelloServer', {
            client: 'angularClient_' + BUILD_NR
          });

          if (!angular.isUndefined(scheduler)) {
            $interval.cancel(scheduler);
            scheduler = undefined;
          }
          scheduler = $interval(function() {
            var t = new Date().getTime();
            send('ClientPing', {
              time: t
            });
          }, 90000);

          if (!angular.isUndefined(reconnectPromise)) {
            $interval.cancel(reconnectPromise);
            reconnectPromise = undefined;
            msgBus.emitMsg({
              type: 'WebSocketOpen'
            });
          }

          $rootScope.$watch(function() {
            return ooAuthService.getToken();
          }, function(token) {
            $log.debug('Token changed, login/logout to websocket',
              token);
            if (token) {
              //login to websocket as well
              send('Login', {
                token: token
              });
            } else {
              // logout
              send('Logout');
            }
          });
        };
        ws.onclose = function(event) {
          var reason;
          // See http://tools.ietf.org/html/rfc6455#section-7.4.1
          if (event.code === 1000) {
            reason =
              'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.';
          } else if (event.code === 1001) {
            reason =
              'An endpoint is \'going away\', such as a server going down or a browser having navigated away from a page.';
          } else if (event.code === 1002) {
            reason =
              'An endpoint is terminating the connection due to a protocol error';
          } else if (event.code === 1003) {
            reason =
              'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).';
          } else if (event.code === 1004) {
            reason =
              'Reserved. The specific meaning might be defined in the future.';
          } else if (event.code === 1005) {
            reason = 'No status code was actually present.';
          } else if (event.code === 1006) {
            reason =
              'The connection was closed abnormally, e.g., without sending or receiving a Close control frame';
          } else if (event.code === 1007) {
            reason =
              'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [http://tools.ietf.org/html/rfc3629] data within a text message).';
          } else if (event.code === 1008) {
            reason =
              'An endpoint is terminating the connection because it has received a message that \'violates its policy\'. This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
          } else if (event.code === 1009) {
            reason =
              'An endpoint is terminating the connection because it has received a message that is too big for it to process.';
          } else if (event.code === 1010) { // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            reason =
              'An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn\'t return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: ' +
              event.reason;
          } else if (event.code === 1011) {
            reason =
              'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.';
          } else if (event.code === 1015) {
            reason =
              'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can\'t be verified).';
          } else {
            reason = 'Unknown reason';
          }
          $log.debug('WS closed with a reason:' + reason, event, new Date());
          msgBus.emitMsg({
            type: 'WebSocketClosed',
            reason: reason
          });

          //retry opening WebSocket every 5 seconds
          if (angular.isUndefined(reconnectPromise)) {
            reconnectPromise = $interval(function() {
              $rootScope.messagingSocket = openWebSocket(url);
            }, 5000);
          }
        };
        return ws;
      };

      return {
        //send message to server
        send: send,
        //start websocket based messaging
        start: function() {
          $log.debug('registering websocket, request websocket url');
          var wsUrl = API_WS_URL.replace('http://', 'ws://').replace(
            'https://', 'wss://');
          $log.debug('registering websocket, bind to ' + wsUrl);
          //append token to websocket url because normal http headers can't get controlled
          var securedUrl = wsUrl; //+ '?auth='+userService.getToken();
          if (!(angular.isDefined($rootScope.messagingSocket)) && wsUrl.substring(
              0, 2) !== '@@') {
            $rootScope.messagingSocket = openWebSocket(securedUrl);
          }
        }
      };
    }
  ]);
