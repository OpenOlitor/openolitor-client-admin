'use strict';

angular.module('openolitor-admin')
  .factory('EmailUtil', ['EMAIL_TO_ADDRESS', '$window', 'lodash', 'alertService', 'gettext',
    function(EMAIL_TO_ADDRESS, $window, _, alertService, gettext) {

        var generateMailToLink = function(bcc, to) {
          if (_.isEmpty(bcc) && _.isEmpty(to)) {
            alertService.addAlert('info', gettext('Keine E-Mail-Adressen ausgewählt'));
            return;
          }
          var bccAddresses = (bcc && '?bcc=' + _.join(bcc) || '');
          var toAddresses = (to && _.join(to)) || EMAIL_TO_ADDRESS;

          $window.open('mailto:' + toAddresses + bccAddresses);
        };

      return {
        toMailToLink: function(emailAddresses, bccAddresses) {
          generateMailToLink(bccAddresses, emailAddresses);
        },

        toMailToBccLink: function(emailAddresses) {
          generateMailToLink(emailAddresses);
        }
      }
    }
  ]);
