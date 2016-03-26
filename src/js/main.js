import Context  from './Context';
import Project from './Project';

/*
This software include the following third-party programs :

   Mocha
   Original Source:     http://mochajs.org/
   Original Copyright:  Copyright (c) 2011-2015 TJ Holowaychuk <tj@vision-media.ca>
   Original License:    MIT
*/

// v0.1.2

/**
 *
 * Example :
 *
 * test('test success', true);                          // success
 *
 * test('test fail', false);                            // fail
 *
 * test('1', 1).toEqual(1);                             // success
 * test('1', 1).toEqual('1');                           // success
 * test('1', 1).strict.toEqual('1');                    // fail
 * test('1', 1).not.toEqual('1');                       // false
 * test('1', 1).not.strict.toEqual('1');                // success
 *
 * test.section('Groups');
 *
 * test('group true', function() {
 *    return true;
 * });                                                  // success
 *
 * test('group 1, no return', function() {
 *    test('innerGroup : test success', true);
 *    test('innerGroup : test failed', false);
 * });
 *
 *
 * test.section('Async');
 *
 * test.async('asyncFunction', function() {
 *    return 1;
 * }).toEqual(1); // success
 *
 * test.async('asyncFunction', function() {
 *
 *    test('asyncFunction : success', true);            // success
 *    return 'a value';
 *
 * }).then(function(test, value) {
 *    test('async.then', value).toBeInstanceof(String); // success
 *    return 1
 * }).toEqual(1);                                       // success
 *
 */

var test = (function (global, nonStrictFunction) {
   'use strict';

   var define;

   nonStrictFunction.groupCollapsed = function() {
      nonStrictFunction.Console_groupCollapsed.apply(console, arguments);
   };

   nonStrictFunction.groupEnd = function() {
      nonStrictFunction.Console_groupEnd.apply(console, arguments);
   };

   nonStrictFunction.warn = function() {
      nonStrictFunction.Console_warn.apply(console, arguments);
   };

   nonStrictFunction.log = function() {
      nonStrictFunction.Console_warn.apply(console, arguments);
   };

   define = function () //noinspection JSLint
   {};
   define.amd = undefined;

   /*
       *    - startDate
       *    - endDate
       *    - duration
       *    - second
       *    - countTotal
       *    - countSuccess
       *    - countFail
       *    - yes
       *    - no
    */

   /**
    * @typedef {Object} TestExport
    * @property {SectionExport[]} sections
    *
    */

   /**
    * @typedef {Object} SectionExport
    * @property {TestUnitExport[]} testUnits
    * @property {string}           title
    *
    */

   /**
    * @typedef {Object} TestUnitExport
    * @property {boolean}          async
    * @property {TestExport}       childTests
    * @property {TestUnitExport[]} nextTest
    * @property {boolean}          not
    * @property {boolean}          strict
    * @property {string}           title
    * @property {string}           type
    *
    */

   var project                                   = new Project();
   
   return Context(project);

})(this, { Console_groupCollapsed : console.groupCollapsed
         , Console_groupEnd       : console.groupEnd
         , Console_warn           : console.warn
         , Console_log            : console.log});

export default test;
module.exports = test;

if (window)
   window.test = test;