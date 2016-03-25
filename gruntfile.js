'use strict';

const BUILD_FOLDER = './build';
var initConfig;

initConfig = {

    browserify : {
        build : {
            files : {
                './index.js' : './src/js/index.js'
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
            { src: './src/test.htm'    , dest: './test/test.htm'  }
          , { src: './build/testJS.css', dest: './test/testJS.css'}
          , { src: './index.js'        , dest: './test/index.js'  }
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
          './build/testJS.css': './src/stylesheets/testJS.scss'
        }
      }
    }
   
  , uglify : {
      build : {
         files : {
            './index.js': './index.js'
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


