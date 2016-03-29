'use strict';

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Project = require('./Project');

var _Project2 = _interopRequireDefault(_Project);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var test = function () {
  'use strict';

  var define;

  define = function define() //noinspection JSLint
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

  var project = new _Project2.default();

  return (0, _Context2.default)(project);
}();

module.exports = test;

try {
  window.test = test;
} catch (ex) {}
//# sourceMappingURL=main.js.map
