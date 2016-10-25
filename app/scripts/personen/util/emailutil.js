'use strict';

angular.module('openolitor-admin')
  .factory('EmailUtil', ['EMAIL_TO_ADDRESS', '$window', 'lodash', 'alertService', 'gettext',
    function(EMAIL_TO_ADDRESS, $window, _, alertService, gettext) {
      return {
        toMailToLink: function(emailAddresses) {
          if (_.isEmpty(emailAddresses)) {
            alertService.addAlert('info', gettext('Keine E-Mail-Adressen ausgewählt'));
            return;
          }
          var bcc = _.join(emailAddresses);

          $window.open('mailto:' + EMAIL_TO_ADDRESS + '?bcc=' + bcc + '');
        }
      }
    }
  ]);
