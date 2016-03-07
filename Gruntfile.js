// Generated on 2014-12-29 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/**/*.js'
var serveStatic = require('serve-static');

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'sliv'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect, options) {
            return [
              serveStatic('.tmp'),
              serveStatic(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        'test/{,*/}*.js'
      ]
    },

    'babel': {
      test: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['scripts/**/*.js'],
          dest: '.tmp'
        }]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: [
            'styles/main.scss'
            ],
          dest: '.tmp',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: [
            'styles/main.scss'
            ],
          dest: '.tmp',
          ext: '.css'
        }]
      }
    },

    less: {
      server: {
        files: {
          '.tmp/styles/bootstrap.css': '<%= config.app %>/styles/bootstrap.less'
        }
      },
      dist: {
        files: {
          '.tmp/styles/bootstrap.css': '<%= config.app %>/styles/bootstrap.less'
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    uglify: {
      dist: {
        files: [{
          '.tmp/scripts/vendor.js': [
            '.tmp/scripts/vendor.js',
          ]
        },
        {
          '.tmp/scripts/main.js': [
            '.tmp/scripts/main.js',
          ]
        }]
      }
    },

    concat: {
      live: {
        options:{
          sourceMap: true
        },
        files: [{
            '.tmp/scripts/main.js': [
              '<%= config.app %>/scripts/main.js'
            ]
          }]
      },
      dist: {
        options:{
          sourceMap: true
        },
        files: [{
          '.tmp/scripts/vendor.js': [
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/d3/d3.js'
          ]
        },
        {
          '.tmp/scripts/main.js': [
            '<%= config.app %>/scripts/main.js'
          ]
        }]
      },
      vendor:{
        files:[{
          '.tmp/styles/vendor.css': [
            '.tmp/styles/bootstrap.css',
            'node_modules/nvd3/build/nv.d3.css'
          ]
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'fonts/{,*/}*.*',
            'data/*.csv'
          ]
        }, {
          src: '<%= config.app %>/.htpasswd',
          dest: '<%= config.dist %>/.htpasswd'
        }, {
          src: '<%= config.app %>/.htaccess',
          dest: '<%= config.dist %>/.htaccess'
        }, {
          src: '.tmp/scripts/main.js',
          dest: '<%= config.dist %>/scripts/main.js'
        }, {
          src: '.tmp/scripts/vendor.js',
          dest: '<%= config.dist %>/scripts/vendor.js'
        }, {
          src: '.tmp/styles/vendor.css',
          dest: '<%= config.dist %>/styles/vendor.css'
        }, {
          src: '.tmp/styles/main.css',
          dest: '<%= config.dist %>/styles/main.css'
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server',
        'less:server',
      ],
      dist: [
        'sass:dist',
        'less:dist',
        'imagemin',
        'svgmin'
      ]
    },

    browserify: {
      dev: {
        src: ['./.tmp/scripts/main.js'],
        dest: './.tmp/scripts/main.js',
        options: {
          debug: true,
          external: ['jquery'],
          browserifyOptions: {
            debug: true
          }
        }
      }
    },
    customizeBootstrap: {
      dev: {
        options: {
          bootstrapPath: 'node_modules/bootstrap',
          src: 'app/styles/bootstrap/',
          dest: 'app/styles/'
        }
      }
    },
    shell:{
      i18nBuild:{
          command: ['cd i18n', 'node csv2src'].join('&&')
      },
      i18nCopy:{
          command: ['cd i18n', 'cp translations.js ../app/scripts/translations.js'].join('&&')
      },
      indexStaging: {
        command: [
        'cd <%= config.dist %>',
        'sed -i "" -e "s/<!--STAGING\\(<base[ a-z:./=\\"0-9]*>\\)-->/\\1/" index.html', // jshint ignore:line, uncomment base tag for staging
        ].join('&&')
      },
      test:{
        command:[
        'node_modules/.bin/mocha test/*.js'
        ].join('&&')
      }
    }
  });

  grunt.registerTask('watch-test', function(){
    grunt.config.merge({
      watch: {
        jstest: {
          files: ['test/{,*/}*.js', '<%= config.app %>/scripts/{,*/}*.js'],
          tasks: ['babel:test', 'shell:test']
        }
      }
      });
    grunt.task.run('watch');
  });

  grunt.registerTask('watch-dev', function(){
    grunt.config.merge({
      watch: {
        js: {
          files: ['<%= config.app %>/scripts/{,*/}*.js'],
          tasks: ['concat:live', 'browserify'],
          options: {
            livereload: true
          }
        },
        sass: {
          files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
          tasks: ['sass:server', 'autoprefixer']
        },
        less: {
          files: ['<%= config.app %>/styles/{,*/}*.less'],
          tasks: ['less:server', 'concat:vendor', 'autoprefixer']
        },
        templates: {
          files: ['<%= config.app %>/scripts/{,*/}*.jade'],
          tasks: ['concat', 'browserify'],
          options: {
            livereload: true
          }
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= config.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= config.app %>/images/{,*/}*'
          ]
        }
      }
    });
    grunt.task.run('watch');
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'concat',
      'browserify',
      'connect:livereload',
      'watch-dev'
    ]);
  });

  grunt.registerTask('i18n:compile', 'Convert csv to json, copy it to source', ['shell:i18nBuild', 'shell:i18nCopy']);

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'browserify',
    'uglify',
    'copy:dist',
    'htmlmin'
  ]);

  grunt.registerTask('build:staging', 'modify builded files in dist folder, to work in staged, local apache environment.', ['build', 'shell:indexStaging']);

  grunt.registerTask('default', [
    'newer:jshint',
    'babel:test',
    'shell:test',
    'build'
  ]);
};
