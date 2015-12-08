'use strict';

// based on the works of https://github.com/zhaber/angular-js-bootstrap-datetimepicker
angular.module('openolitor')
  .directive('ooDatepickerPopup', function() {
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function(scope, element, attr, controller) {
        //remove the default formatter from the input directive to prevent conflict
        controller.$formatters.shift();
      }
    };
  })
  .directive('ooDatepicker', [
    function() {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          ngClass: '=',
          dayFormat: '=',
          monthFormat: '=',
          yearFormat: '=',
          dayHeaderFormat: '=',
          dayTitleFormat: '=',
          monthTitleFormat: '=',
          startingDay: '=',
          yearRange: '=',
          dateFormat: '=',
          minDate: '=',
          maxDate: '=',
          dateOptions: '=',
          dateDisabled: '&',
          hourStep: '=',
          minuteStep: '=',
          showMeridian: '=',
          meredians: '=',
          mousewheel: '=',
          readonlyTime: '=',
          readonlyDate: '=',
          ngChange: '='
        },
        template: function(elem, attrs) {
          function dashCase(name) {
            return name.replace(/[A-Z]/g, function(letter, pos) {
              return (pos ? '-' : '') + letter.toLowerCase();
            });
          }

          function createAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + dateTimeAttr + '\" ';
            } else {
              return '';
            }
          }

          function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + dateTimeAttr + '({' + funcArgs + '})\" ';
            } else {
              return '';
            }
          }

          function createEvalAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + '=\"' + attrs[dateTimeAttr] + '\" ';
            } else {
              return dashCase(innerAttr) + ' ';
            }
          }

          function createAttrConcat(previousAttrs, attr) {
            return previousAttrs + createAttr.apply(null, attr);
          }
          var tmpl = '<div class=\"datetimepicker-wrapper\">' +
            '<input class=\"form-control\" type=\"text\" ' +
            'ng-click=\"open($event)\" ' +
            'ng-change=\"ngChange\" ' +
            'is-open=\"opened\" ' +
            'ng-class=\"ngClass\" ' +
            'ng-model=\"ngModel\" ' + [
              ['minDate'],
              ['maxDate'],
              ['dayFormat'],
              ['monthFormat'],
              ['yearFormat'],
              ['dayHeaderFormat'],
              ['dayTitleFormat'],
              ['monthTitleFormat'],
              ['startingDay'],
              ['yearRange'],
              ['datepickerOptions', 'dateOptions'],
              ['ngDisabled', 'readonlyDate']
            ].reduce(createAttrConcat, '') +
            createFuncAttr('dateDisabled', 'date: date, mode: mode') +
            createEvalAttr('uibDatepickerPopup', 'dateFormat') +
            createEvalAttr('currentText', 'currentText') +
            createEvalAttr('clearText', 'clearText') +
            createEvalAttr('closeText', 'closeText') +
            createEvalAttr('placeholder', 'placeholder') +
            '/>\n' +
            '</div>\n';
          return tmpl;
        },
        controller: ['$scope',
          function($scope) {
            $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.opened = true;
            };
          }
        ]
      };
    }
  ]);

