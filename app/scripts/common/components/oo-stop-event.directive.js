'use strict';

angular.module('openolitor').directive('ooStopEvent', [function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.bind('click', function(e) {
        e.stopPropagation();
      });
    }
  };
}]);
