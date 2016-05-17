'use strict';

angular.module('openolitor')
  .directive('ooCompareTo', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=ooCompareTo'
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.ooCompareTo = function(modelValue) {
          return modelValue === scope.otherModelValue;
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });
