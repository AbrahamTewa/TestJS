'use strict';

Object.defineProperty(exports, "__esModule", {
               value: true
});
/**
 * @typedef {Promise} TestPromise
 * @property {function}    comment
 * @property {function}    describe
 * @property {TestPromise} not
 * @property {function}    todo
 *
 */

/**
 * @typedef {Object}
 * @name TestUnitParameters
 *
 * @property {boolean}             async
 * @property {TestContext}         context
 * @property {number}              executionDelay
 * @property {TestUnit|Section}    parent
 * @property {Project}             project
 * @property {string|undefined}    promiseRole
 * @property {boolean}             strict
 * @property {TestContext}         testFunction
 * @property {string}              title
 * @property {number}              timeout
 *
 */

/**
 * @typedef {Object} TestTypeParameter
 * @property {string}            name
 * @property {function: boolean} test
 * @property {function: boolean} strict
 * @property {boolean}           onerror
 *
 */

/**
 * @param {TestTypeParameter} parameters
 * @constructor
 * @class TestType
 * @property {string}          name
 * @property {function)        operation
 * @property {function)        strictOperation
 * @property {function:string} toString
 * @property {boolean}
 */
var TestType = function TestType(parameters) {
               this.name = parameters.name;
               this.test = parameters.test;
               this.strictTest = parameters.strict;
               this.onerror = parameters.onerror === undefined ? false : parameters.onerror;
};

/**
 *
 * @param {TestTypeParameter} parameters
 */
TestType.add = function add(parameters) {

               var /** @type {TestType} */testType;

               testType = new TestType(parameters);

               TestType.all[testType.name] = testType;
};

/**
 *
 * @type {Object.<TestType>}
 */
TestType.all = {};

TestType.add({ name: 'contains',
               test: function contains(a, b) {
                              return a.indexOf(b);
               } });

TestType.add({ name: 'equal',
               test: function equal(a, b, c) {
                              return a == (arguments.length === 3 ? c : b);
               },
               strict: function equal(a, b, c) {
                              return a === (arguments.length === 3 ? c : b);
               } });

TestType.add({ name: 'isBetween',
               test: function isBetween(a, b, c) {
                              return a >= b && a <= c;
               } });

TestType.add({ name: 'isDefined',
               test: function isDefined(a) {
                              return a != undefined;
               },
               strict: function isDefined(a) {
                              return a !== undefined;
               } });

TestType.add({ name: 'isDifferentThan',
               test: function isDifferentThan(a, b) {
                              return a != b;
               },
               strict: function isDifferentThan(a, b) {
                              return a !== b;
               } });

TestType.add({ name: 'isFalse',
               test: function isFalse(a) {
                              return a ? false : true;
               },
               strict: function isFalse(a) {
                              return a === false;
               } });

TestType.add({ name: 'isGreaterOrEqualThan',
               test: function isGreaterOrEqualThan(a, b) {
                              return a >= b;
               } });

TestType.add({ name: 'isGreaterThan',
               test: function isGreaterThan(a, b) {
                              return a > b;
               } });

TestType.add({ name: 'isInstanceOf',
               test: function isInstanceOf(a, b) {
                              return a instanceof b;
               } });

TestType.add({ name: 'isLesserOrEqualThan',
               test: function isLesserOrEqualThan(a, b) {
                              return a <= b;
               } });

TestType.add({ name: 'isLesserThan',
               test: function isLesserThan(a, b) {
                              return a < b;
               } });

TestType.add({ name: 'isNull',
               test: function isNull(a) {
                              return a == null;
               },
               strict: function isNull(a) {
                              return a === null;
               } });

TestType.add({ name: 'isTrue',
               test: function isTrue(a) {
                              return a ? true : false;
               },
               strict: function isTrue(a) {
                              return a === true;
               } });

TestType.add({ name: 'isUndefined',
               test: function isUndefined(a) {
                              return a == undefined;
               },
               strict: function isUndefined(a) {
                              return a === undefined;
               } });

TestType.add({ name: 'throwValue',
               onerror: true,
               test: function isUndefined(a, b) {
                              return a == b;
               },
               strict: function isUndefined(a, b) {
                              return a === b;
               } });

TestType.add({ name: 'throw',
               onerror: true,
               test: function isUndefined(errorRaised, errorInstance) {
                              return errorRaised instanceof errorInstance;
               } });

exports.default = TestType;
//# sourceMappingURL=TestType.js.map
