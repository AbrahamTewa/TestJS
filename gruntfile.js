'use strict';

const BUILD_FOLDER = './build';
var initConfig;

var /** @type {boolean} */ debug;

debug = true;

initConfig = {

    browserify : {
        build : {
            files : {
                './test-js.js' : './src/js/main.js'
            }
          , options : {
                transform  : [['babelify', { presets: ["es2015"] }]]
              , standalone : false
              , node       : false
              , browserifyOptions : {debug : debug}
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
             , 'test-js.js.map'
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

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', [ 'clean:build'
                              , 'browserify:build'
                              , 'browserify:test'
                              , 'sass:build'
                              , 'uglify:build'
                              , 'copy:test']);

  grunt.registerTask('default', ['build']);
};


