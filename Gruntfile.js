// Generated using generator-angular
'use strict';

const sass = require('node-sass');

module.exports = function(grunt) {
  /*jshint camelcase: false */

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  require('grunt-connect-proxy')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var serveStatic = require('serve-static');

  //TODO Mandantenfähigkeit fehlt (siehe var config = ...)
  var env = 'dev';
  if (grunt.option('env') !== null && grunt.option('env') !== undefined) {
    env = grunt.option('env');
  }

  // text replace in js files used for environment specific configurations
  var config = {
    BUILD_NR: grunt.option('buildnr') || 'dev',
  };

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    openolitor: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // task used to replace config values in js files
    replace: {
      options: {
        patterns: [
          {
            json: config
          }
        ]
      },
      dev: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= openolitor.app %>/scripts/app.js'],
            dest: '.tmp/scripts'
          }
        ]
      },
      prod: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['.tmp/concat/scripts/scripts.js'],
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: [
          '<%= openolitor.app %>/scripts/**/*.js',
          '<%= openolitor.app %>/bower_components/openolitor-core/scripts/**/*.js'
        ],
        tasks: ['newer:jshint:all', 'replace:dev'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        files: ['<%= openolitor.app %>/styles/**/*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= openolitor.app %>/scripts/**/*.html',
          '<%= openolitor.app %>/index.html',
          '.tmp/styles/**/*.css',
          '<%= openolitor.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      proxies: [
        {
          context: '/api-',
          host: 'localhost',
          port: 9003,
          https: false,
          xforward: false,
          ws: true,
          rewrite: {
            '^/api-(.*)$': '/$1',
            '^/api-(.*/ws)$': '/$1'
          }
        }
      ],
      options: {
        port: 9001,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: ['.tmp', '<%= openolitor.app %>'],
          middleware: function (connect, options) {
              if (!Array.isArray(options.base)) {
                  options.base = [options.base];
              }

              // Setup the proxy
              var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

              // Serve static files.
              options.base.forEach(function(base) {
                  middlewares.push(serveStatic(base));
              });

              return middlewares;
          }
        }
      },
      test: {
        options: {
          port: 9001,
          base: ['.tmp', 'test', '<%= openolitor.app %>']
        }
      },
      dist: {
        options: {
          base: '<%= openolitor.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= openolitor.app %>/scripts/{,*/}*.js',
        '!<%= openolitor.app %>/scripts/i18n/translations.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= openolitor.dist %>/*',
              '!<%= openolitor.dist %>/.git*',
              '!<%= openolitor.dist %>/index.php'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',
            src: '**/*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      options: {
        //        cwd: '<%= openolitor.app %>'
      },
      app: {
        src: ['<%= openolitor.app %>/index.html'],
        exclude: ['bower_components/bootstrap-sass-official/*'],
        ignorePath: '<%= openolitor.app %>/'
      },
      sass: {
        src: ['<%= openolitor.app %>/styles/**/*.{scss,sass}'],
        ignorePath: '<%= openolitor.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
        includePaths: ['app/bower_components']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= openolitor.app %>/styles',
            src: ['*.scss'],
            dest: '.tmp/styles',
            ext: '.css'
          }
        ]
      },
      server: {
        files: [
          {
            expand: true,
            cwd: '<%= openolitor.app %>/styles',
            src: ['*.scss'],
            dest: '.tmp/styles',
            ext: '.css'
          }
        ]
      }
    },

    uglify: {
      options: {
        exceptionsFiles: [ 'uglifyExceptions.json' ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= openolitor.dist %>/scripts/**/*.js',
            '<%= openolitor.dist %>/styles/**/*.css',
            '<%= openolitor.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= openolitor.dist %>/styles/fonts/**/*',
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= openolitor.app %>/index.html',
      options: {
        dest: '<%= openolitor.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['<%= openolitor.dist %>/**/*.html'],
      css: ['<%= openolitor.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= openolitor.dist %>', '<%= openolitor.dist %>/images']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= openolitor.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= openolitor.app %>/images',
            src: '**/*.{jpg,jpeg,gif}', // png doesn't work on buildserver
            dest: '<%= openolitor.dist %>/images'
          }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= openolitor.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= openolitor.dist %>/images'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= openolitor.dist %>',
            src: ['*.html', 'scripts/**/*.html'],
            dest: '<%= openolitor.dist %>'
          }
        ]
      }
    },

    // ngAnnotate tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= openolitor.app %>',
            dest: '<%= openolitor.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'scripts/**/*.html',
              'images/**/*.{webp,png,jpg}',
              'third_party/**',
              'fonts/**/*'
            ]
          },
          {
            expand: true,
            cwd: '<%= openolitor.app %>',
            dest: '<%= openolitor.dist %>',
            src: ['environments/*']
          },
          {
            expand: true,
            cwd: '.',
            dest: '<%= openolitor.dist %>',
            src: ['nginx.conf']
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= openolitor.dist %>/images',
            src: ['generated/*']
          },
          {
            //for bootstrap fonts, maybe we could use the scss/less where the correct font url path will be inserted
            expand: true,
            dot: true,
            cwd: '<%= openolitor.app %>/bower_components/bootstrap/dist',
            src: ['fonts/*.*'],
            dest: '<%= openolitor.dist %>'
          },
          {
            //for font-awesome
            expand: true,
            dot: true,
            cwd: '<%= openolitor.app %>/bower_components/font-awsome',
            src: ['fonts/*.*'],
            dest: '<%= openolitor.dist %>'
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= openolitor.app %>/styles',
        dest: '.tmp/styles/',
        src: '**/*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: ['sass:server', 'copy:styles'],
      test: ['copy:styles'],
      dist: ['sass', 'copy:styles', 'imagemin', 'svgmin']
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      },
      live: {
        configFile: 'test/karma.conf.js',
        singleRun: false,
        autoWatch: true
      },
      continuous: {
        configFile: 'test/karma.conf.js',
        singleRun: 'true',
        browsers: ['PhantomJS'],
        reporters: ['dots', 'junit', 'coverage'],
        junitReporter: {
          outputFile: 'test/test-results.xml'
        },
        coverageReporter: {
          reporters: [
            {
              type: 'lcov',
              dir: 'test/coverage/reports'
            },
            {
              type: 'text',
              dir: 'test/coverage/reports'
            }
          ]
        },
        preprocessors: {
          // source files, that you wanna generate coverage for
          // do not include tests or libraries
          // (these files will be instrumented by Istanbul)
          'app/scripts/**/*.js': ['coverage'],
          'app/scripts/**/*.html': ['ng-html2js']
        }
      }
    },

    protractor: {
      options: {
        configFile: 'test/protractor.conf.js', // Default config file
        keepAlive: true, // If false, the grunt process stops when the test fails.
        noColor: false, // If true, protractor will not use colors in its output.
        args: {
          // Arguments passed to the command
        }
      },
      all: {} // Grunt requires at least one target to run so you can simply put 'all: {}' here too.
    },

    protractor_webdriver: {
      default: {
        options: {
          command: 'custom-webdriver-manager start --standalone'
        }
      }
    },

    // i18n
    nggettext_extract: {
      pot: {
        files: {
          'i18n/template.pot': [
            '<%= openolitor.app %>/**/*.html',
            '<%= openolitor.app %>/**/*.js',
            '!<%= openolitor.app %>/bower_components/**'
          ]
        }
      }
    },

    nggettext_compile: {
      all: {
        files: {
          '<%= openolitor.app %>/scripts/i18n/translations.js': ['i18n/*/*.po']
        }
      }
    }
  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'configureProxies:server',
      'connect:livereload',
      'replace:dev',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn(
      'The `server` task has been deprecated. Use `grunt serve` to start a server.'
    );
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('core-test', [
    'newer:jshint',
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test'
  ]);

  grunt.registerTask('test', ['core-test', 'karma:unit']);

  grunt.registerTask('~test', ['core-test', 'karma:live']);

  grunt.registerTask('citest', ['clean', 'core-test', 'karma:continuous']);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'replace:prod',
    'ngAnnotate',
    'copy:dist',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin',
  ]);

  grunt.registerTask('i18nextract', ['nggettext_extract']);

  grunt.registerTask('default', ['citest', 'build']);
};
