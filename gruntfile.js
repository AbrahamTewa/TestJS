'use strict';

const BUILD_FOLDER = './build';
var initConfig;

initConfig = {

    browserify : {
        build : {
            files : {
                './test-js.js' : './src/js/test-js.js'
            }
          , options : {
                transform  : [['babelify', { presets: ["es2015"] }]]
              , standalone : false
              , node       : false
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
      build :['./test/']
    }

  , copy : {
      test : {
        files : [
            { src: './src/test.htm', dest: './test/test.htm'   }
          , { src: './test-js.js'  , dest: './test/test-js.js' }
          , { src: './test-js.css' , dest: './test/test-js.css'}
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
         files : {
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


