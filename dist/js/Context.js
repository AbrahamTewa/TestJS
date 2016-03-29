'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _TestUnit = require('./TestUnit');

var _TestUnit2 = _interopRequireDefault(_TestUnit);

var _private = require('./private');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} ThisTestContextInfo
 * @property {boolean}  async
 * @property {TestUnit} parent
 * @property {Project}  project
 * @property {boolean}  strict
 * @property {TestUnit} test
 *
 */

/**
 * @typedef {Object}
 * @name ThisTestContext
 * @property {ThisTestContextInfo} info
 * @property {TestContext}         context
 *
 */

/**
 *
 * @param {string}                    title
 * @param {*}                         [param2]
 * @param {*}                         [param3]
 * @param {number}                    [param4]
 * @name TestContext
 * @returns {Promise|TestContext|Section}
 * @this ThisTestContext
 * @property {TestContext}            async
 * @property {TestContext}            context
 * @property {boolean}                disabled
 * @property {function}               done
 * @property {function}               reset
 * @property {function}               setContext
 * @property {TestContext}            strict
 * @property {ThisTestContextInfo}    info
 */
var TestContext = function test(title, param2, param3, param4) {

   var /** @type {number}   */executionDelay, /** @type {Section}  */section, /** @type {TestUnit} */testUnit, /** @type {number}   */timeout, /** @type {*}        */value;

   if (arguments.length === 1) {

      if (!this.info.enabled) return this.context;

      section = new _Section2.default(this.info.project, title, false, this.info.test);

      this.info.test.sections.push(section);
      return section;
   }

   if (this.info.delay) {
      executionDelay = param2;
      value = param3;
      timeout = param4;
   } else {
      executionDelay = false;
      value = param2;
      timeout = param3;
   }

   section = this.info.test.sections[this.info.test.sections.length - 1];

   //noinspection JSUnresolvedVariable
   testUnit = new _TestUnit2.default({ async: this.info.async,
      context: this,
      enabled: this.info.enabled,
      executionDelay: executionDelay,
      strict: this.info.strict,
      parent: section,
      project: this.info.project,
      value: value,
      timeout: timeout,
      title: title });

   // Adding the test to the last section
   //noinspection JSUnresolvedVariable
   section.addTest(testUnit);

   this.reset();

   return testUnit.getPromise();
};

/**
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var async = function async() {
   if (this.info.enabled) this.info.async = true;

   return this.context;
};

/**
 *
 * @param {TestUnit} test
 * @return TestContext
 */
var build = function build(test) {

   var /** @type {ThisTestContext}     */thisObject, /** @type {function}            */testContext;

   thisObject = { info: { async: false,
         enabled: true,
         delay: false,
         strict: false,
         test: test,
         project: test.getProject() } };

   testContext = TestContext.bind(thisObject);
   testContext.console = console.bind(thisObject);
   testContext.comment = comment.bind(thisObject);
   testContext.describe = describe.bind(thisObject);
   testContext.disable = disable.bind(thisObject);
   testContext.display = display.bind(thisObject);
   testContext.done = done.bind(thisObject);
   testContext.getData = getData.bind(thisObject);
   testContext.note = note.bind(thisObject);
   testContext.constructors = { Test: _TestUnit2.default };
   testContext.reset = reset.bind(thisObject);
   testContext.todo = todo.bind(thisObject);
   testContext._info = getInfo.bind(thisObject);

   Object.defineProperties(testContext, { async: { get: async.bind(thisObject) },
      delay: { get: delay.bind(thisObject) },
      parent: { get: parent.bind(thisObject) },
      project: { get: project.bind(thisObject) },
      strict: { get: strict.bind(thisObject) } });

   thisObject.context = testContext;
   thisObject.reset = testContext.reset;

   return testContext;
};

/**
 * @param {string} text
 * @returns {ThisTestContextInfo}
 */
var comment = function comment(text) {
   this.info.test.comment(text);
   return this.context;
};

/**
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var console = function console(failedOnly) {
   if (this.info.enabled) this.info.test.console(failedOnly);

   return this.context;
};

/**
 *
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var delay = function delay() {
   if (this.info.enabled) this.info.delay = true;

   return this.context;
};

/**
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var disable = function disable() {
   if (this.info.enabled) this.info.enabled = false;

   return this.context;
};

/**
 * @param {string} text
 * @returns {ThisTestContextInfo}
 */
var describe = function describe(text) {
   this.info.test.describe(text);
   return this.context;
};

/**
 *
 * @param {string|HTMLElement} location
 */
var display = function display(location) {
   this.info.project.display(location);
};

/**
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var done = function done() {

   if (this.info.enabled) this.info.test.done();

   return this.context;
};

/**
 *
 * @param {boolean} failedOnly
 * @this {ThisTestContext}
 */
var getData = function getData(failedOnly) {

   var /** @type {Object}  */data;

   data = this.info.test.getData(failedOnly);

   return { endTime: this.info.test.getEndTime(),
      failed: this.info.test.countFailedTests(),
      sections: data.sections,
      startTime: this.info.test.getStartTime(),
      success: this.info.test.countSuccessfulTests(),
      tests: this.info.test.countTotalTests() };
};

/**
 *
 * @param {Object} receivedToken
 * @this {ThisTestContext}
 * @returns {ThisTestContextInfo}
 * @constructor
 */
var getInfo = function getInfo(receivedToken) {

   if (receivedToken !== _private.token) throw 'Invalid token';

   return this.info;
};

/**
 *
 * @param {string} note
 * @returns {ThisTestContextInfo}
 */
var note = function note(note) {
   this.info.test.note(note);
   return this.context;
};

/**
 *
 * @this {ThisTestContext}
 * @returns {TestUnit}
 */
var parent = function parent() {
   return this.info.test;
};

/**
 *
 * @returns {Project}
 * @this {ThisTestContext}
 */
var project = function project() {
   return this.info.test.project;
};

/**
 *
 * @param {Object} [receivedToken]
 * @param {Object} [info]
 * @constructor
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var reset = function reset(receivedToken, info) {

   var /** @type {Object} */oldInfo;

   if (receivedToken === _private.token) {
      oldInfo = this.info;
      this.info = info;
      //noinspection JSValidateTypes
      return oldInfo;
   }

   if (!this.info.enabled) return this.context;

   this.info.async = false;
   this.info.strict = false;
   this.info.enabled = true;
   this.info.delay = false;

   return this.context;
};

/**
 * @this {ThisTestContext}
 * @returns {TestContext}
 */
var strict = function strict() {
   if (this.info.enabled) this.info.strict = true;

   return this.context;
};

/**
 * @param {string} text
 * @returns {ThisTestContextInfo}
 */
var todo = function comment(text) {
   this.info.test.todo(text);
   return this.context;
};

exports.default = build;
//# sourceMappingURL=Context.js.map
