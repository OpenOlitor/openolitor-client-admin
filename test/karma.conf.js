module.exports = function(config) {
  'use strict';

  config.set({

    basePath: '../',

    files: [
      'app/bower_components/jquery/dist/jquery.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-cookie/angular-cookie.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-touch/angular-touch.js',
      'app/bower_components/ng-table/dist/ng-table.min.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-base64/angular-base64.js',
      'app/bower_components/ng-table-export/ng-table-export.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.js',
      'app/bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',
      'app/bower_components/angular-bootstrap-switch/dist/angular-bootstrap-switch.js',
      'app/bower_components/angular-gettext/dist/angular-gettext.js',
      'app/bower_components/angular-filter/dist/angular-filter.js',
      'app/bower_components/angular-file-saver/dist/angular-file-saver.bundle.js',
      'app/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
      'app/bower_components/angular-color-picker/angularjs-color-picker.js',
      'app/bower_components/angular-hamburger-toggle/dist/angular-hamburger-toggle.js',
      'app/bower_components/angular-moment/angular-moment.js',
      'app/bower_components/ng-file-upload/ng-file-upload.js',
      'app/bower_components/ng-lodash/build/ng-lodash.js',
      'app/bower_components/ng-password-strength/dist/scripts/ng-password-strength.js',
      'app/bower_components/angular-messages/angular-messages.js',
      'app/bower_components/angular-sortable-view/src/angular-sortable-view.js',
      'app/scripts/app.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js',
      'app/scripts/**/*.html'
    ],

    preprocessors: {
      'app/scripts/**/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',
      moduleName: 'templates'
    },

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['PhantomJS'],

    colors: true,

    singleRun: true
  });
};
