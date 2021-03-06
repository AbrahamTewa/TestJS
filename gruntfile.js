'use strict';

const BUILD_FOLDER = './build';
var initConfig;

var /** @type {boolean} */ debug;

debug = true;

initConfig = {

    babel: {
        build : {
            files : [{
                cwd    : 'src'
              , expand : true
              , src    : [ '**/*.js'
                         , '!js/browser.js'
                         , '!js/test.js']
              , dest   : 'dist'
              , ext    : '.js'
            }]
          , options: {
                sourceMap: true
              , presets  : ['es2015']
            }
        }
    }

  , browserify : {
        'build' : {
            files : {
                './test-js.js' : './index.js'
            }
          , options : {
                transform  : [['babelify', { presets: ["es2015"] }]]
              , browserifyOptions : { debug         : debug
                                    , browserField  : true}
            }
        }
      , test : {
            files : {
                './test/test.js'    : './src/js/test.js'
            }
          , options : {
              transform: [['babelify', { presets: ["es2015"] }]]
            }
        }
    }

  , clean : {
      build :['./test/'
             , '/dist/'
             , 'browser.js'
             , 'test-js.js'
             , 'test-js.js.map'
             , 'test-js.css'
             , 'test-js.css.map']
    }

  , copy : {
      test : {
        files : [
            { src: './src/test.htm', dest: './test/test.htm'}
        ]
      }
    }

  , jshint: {
      build: {
        files: {
          src: ['./src/js']
        }
      }
    }

  , sass: {
      build : {
        files: {
          './test-js.css': './src/stylesheets/test-js.scss'
        }
      }
    }
   
  , uglify : {
      build : {

         options : { sourceMap              : true
                   , sourceMapIncludeSources: true}
       , files : {
            './test-js.js': './test-js.js'
         }
      }
   } 

};


module.exports = function(/** @type {grunt} */ grunt) {

  grunt.initConfig(initConfig);
   
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');


var buildTasks = [ 'clean:build'
                 , 'babel:build'
                 , 'browserify:build'
                 , 'browserify:test'
                 , 'sass:build'];
   
   if (!debug)
      buildTasks.push('uglify:build');
   
   buildTasks.push('copy:test');

  grunt.registerTask('build', buildTasks);

  grunt.registerTask('default', ['build']);
};


