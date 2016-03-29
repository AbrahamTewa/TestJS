'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTest_execute = exports.buildTest = undefined;

var _common = require('./common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @typedef {Object} buildTest_executeThis
 *
 * @property {TestUnit} test
 * @property {TestType} type
 *
 */

/**
 *
 * @param {TestUnit} testUnit
 */
var buildTest = function buildTest(testUnit) {

  var /** @type {string}  */name, /** @type {Promise} */promise;

  promise = testUnit.getPromise();

  for (name in TestType.all) {
    promise[name] = buildTest_execute.bind({ test: testUnit, type: TestType.all[name], promise: promise });
  }

  promise.todo = testUnit.todo.bind(testUnit);
  promise.comment = testUnit.comment.bind(testUnit);
  promise.describe = testUnit.describe.bind(testUnit);
  promise.note = testUnit.note.bind(testUnit);
  promise.getResult = testUnit.getResult.bind(testUnit);
  promise.then = testUnit.then.bind(testUnit);
  promise.catch = testUnit.catch.bind(testUnit);

  Object.defineProperty(promise, 'not', { get: function get() {
      testUnit.not;return promise;
    } });

  promise.$ = testUnit;

  return promise;
};

/**
 * @this buildTest_executeThis
 * @return {Promise}
 */
var buildTest_execute = function buildTest_execute() {
  this.test.testType = this.type;
  this.test.testParameters = Array.prototype.slice.call(arguments, 0);
  this.test.testParametersExport = common.copy(this.test.testParameters);
  this.test.calculated = false;
  this.test.errorExpected = this.type.onerror;
  this.test.refresh();

  return this.promise;
};

exports.buildTest = buildTest;
exports.buildTest_execute = buildTest_execute;
//# sourceMappingURL=functions.js.map
