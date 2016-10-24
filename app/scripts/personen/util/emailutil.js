'use strict';

angular.module('openolitor-admin')
  .factory('EmailUtil', ['EMAIL_TO_ADDRESS', '$window', 'lodash', function(EMAIL_TO_ADDRESS, $window, _) {
    return {
      toMailToLink: function(emailAddresses) {
        var bcc = _.join(emailAddresses);

        $window.open('mailto:' + EMAIL_TO_ADDRESS + '?bcc=' + bcc + '');
      }
    }
  }]);
