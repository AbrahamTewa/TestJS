(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _TestUnit = require('./TestUnit');

var _TestUnit2 = _interopRequireDefault(_TestUnit);

var _private = require('./private');

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

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


},{"./Section":6,"./TestUnit":9,"./private":14}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMTest = require('./DOMTest');

var _DOMTest2 = _interopRequireDefault(_DOMTest);

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *
 * @param {Project} project
 * @constructor
 * @class DOMProject
 * @extends DOMTest
 * @property {boolean} collapsed
 * @property {string}  title
 */
var DOMProject = function DOMProject(project) {
   _DOMTest2.default.call(this, project);
   this.project = project;
   this.collapsed = false;
};

DOMProject.prototype = Object.create(_DOMTest2.default.prototype);
//noinspection JSUnusedGlobalSymbols
DOMProject.prototype.constructor = DOMProject;

/**
 * Build the DOM of the project.
 * @param {boolean} collapsed If true, then all tests will be collapsed.
 */
DOMProject.prototype.buildDOM = function buildDOM(collapsed) {

   this.globalDOM = document.createElement('div');
   this.globalDOM.classList.add('testJS');

   _DOMTest2.default.prototype.buildDOM.call(this, collapsed);

   this.dom.classList.remove('test');
   this.dom.classList.add('project');

   this.globalDOM.appendChild(this.dom);

   // Add authors
};

/**
 * @param {string|HTMLElement} location
 */
DOMProject.prototype.display = function display(location) {
   var /** @type {HTMLElement} */dom;

   dom = location instanceof HTMLElement ? location : document.querySelector(location);
   this.buildDOM(false);

   dom.appendChild(this.globalDOM);
};

/**
 *
 * @returns {Object}
 */
DOMProject.prototype.getTemplateData = function getTemplateData() {

   var /** @type {Object} */data;

   data = _DOMTest2.default.prototype.getTemplateData.call(this);
   data['authors'] = this.project.getAuthors();

   return data;
};

exports.default = DOMProject;


},{"./DOMTest":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMTest = require('./DOMTest');

var _DOMTest2 = _interopRequireDefault(_DOMTest);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *
 * @param {Section} section
 * @constructor
 * @class DOMSection
 * @extends {DOMTest}
 * @property {boolean}     collapsed
 * @property {HTMLElement} dom
 * @property {Section}     test
 */
var DOMSection = function DOMSection(section) {
   _DOMTest2.default.call(this, section);
   this.section = section;
};

/**
 * Build the DOM of the section
 */
DOMSection.prototype.buildDOM = function buildDOM(collapsed) {
   _DOMTest2.default.prototype.buildDOM.call(this, collapsed);
};

/**
 *
 */
DOMSection.prototype.destroy = function destroy() {
   _DOMTest2.default.prototype.destroy.apply(this, arguments);
};

/**
 * @returns {Array.<DOMSection|DOMTest>}
 */
DOMSection.prototype.getChildTests = function getTests() {
   var /** @type {Array.<DOMSection|DOMTest>} */domTests, /** @type {number}                     */t, /** @type {Array.<TestUnit|Section>}   */tests;

   tests = this.test.getTests();

   domTests = [];

   for (t in tests) {

      if (tests[t].getDOM() !== undefined) domTests.push(tests[t].getDOM());else domTests.push(new _DOMTest2.default(tests[t]));
   }

   return domTests;
};

/**
 * Return the DOM of the template
 * @param {boolean} [collapsed=false]
 * @returns {HTMLElement}
 */
DOMSection.prototype.getDOM = function getDOM(collapsed) {
   collapsed = collapsed === undefined ? this.collapsed : !!collapsed;

   if (this.dom === undefined || collapsed !== this.collapsed) this.buildDOM(collapsed);

   return this.dom;
};

/**
 *
 * @returns {Object}
 */
DOMSection.prototype.getTemplateData = function () {

   var /** @type {number} */duration, /** @type {number} */endTime, /** @type {number} */startTime;

   startTime = this.section.getStartTime();
   endTime = this.section.getEndTime();

   if (endTime !== undefined) duration = endTime - startTime;

   return { collapsed: this.collapsed,
      totalFails: this.section.countFailedTests(),
      totalSuccesses: this.section.countSuccessfulTests(),
      totalTests: this.section.countTotalTests(),
      description: this.section.getDescription(),
      duration: duration,
      endTime: common.time2string(endTime),
      lang: _lang2.default.section,
      startTime: common.time2string(startTime),
      success: this.section.isSuccessful(),
      title: this.section.getTitle() };
};

/**
 *
 * Lang values :
 *    - startDate
 *    - endDate
 *    - duration
 *    - second
 *    - countTotal
 *    - countSuccess
 *    - countFail
 *    - yes
 *    - no
 *
 * @typedef {Object} SectionTemplateData
 * @property {string}  description  - Description of the section
 * @property {number}  countTotal   - Total number of tests
 * @property {number}  countSuccess - Total number of successful tests
 * @property {number}  countFail    - Total number of failed tests
 * @property {string}  duration     - Duration (in second) of the total execution time
 * @property {string}  endDate      - End date of the latest test of the section
 * @property {string}  startDate    - Date of the first test
 * @property {boolean} success      - If true, then all the test of the section was successful. False otherwise
 * @property {string}  title        - Title of the section
 */

/**
 *
 * @returns {string}
 */
DOMSection.prototype.getTemplate = function getTemplate() {
   return '<div class="test group {{#success}}pass{{/success}}{{^success}}fail{{/success}} {{#collapsed}}collapsed{{/collapsed}} {{#severalFails}}severalFails{{/severalFails}}">' + '<header>' + '<div id="title">{{title}}</div>' + '<div id="description">{{description}}</div>' + '<div id="fails">{{totalFails}}</div>' + '<div id="successes">{{totalSuccesses}}</div>' + '<div id="countTests">{{totalTests}}</div>' + '<div id="successesByTests">{{totalSuccesses}}/{{totalTests}}</div>' + '{{#toDoList}}<div class="todo">{{.}}</div>{{/toDoList}}' + '{{#comments}}<div class="comment">{{.}}</div>{{/comments}}' + '</header>' + '<div id="tests"></div>' + '<div id="nexts"></div>' + '</div>';
};

exports.default = DOMSection;


},{"./DOMTest":4,"./lang":12}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMSection = require('./DOMSection');

var _DOMSection2 = _interopRequireDefault(_DOMSection);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _common = require('./common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) {
   if (obj && obj.__esModule) {
      return obj;
   } else {
      var newObj = {};if (obj != null) {
         for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
         }
      }newObj.default = obj;return newObj;
   }
}

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *
 * @param {TestUnit} test
 * @constructor
 * @class DOMTest
 * @property {TestUnit}                   test
 * @property {Array.<DOMTest|DOMSection>} childTests
 * @property {DOMTest[]}                  promiseTests
 */
var DOMTest = function DOMTest(test) {
   this.test = test;
   this.test.setDOM(this);
   this.childTests = [];
   this.collapsed = true;
};

/**
 * Build the dom of the test
 */
DOMTest.prototype.buildDOM = function buildDOM(collapsed) {

   var /** @type {number}      */c, /** @type {Object}      */data, /** @type {HTMLElement} */domTests, /** @type {HTMLElement} */domHeader, /** @type {number}      */t;

   this.collapsed = collapsed;
   data = this.getTemplateData();

   this.dom = common.render2dom(this.getTemplate(), data);

   domHeader = this.dom.querySelector('header');

   domHeader.addEventListener('click', function (event) {

      var /** @type {HTMLElement} */oldDOM;

      if (this.collapsed) this.dom.classList.remove('collapsed');else this.dom.classList.add('collapsed');

      oldDOM = this.dom;

      this.buildDOM(!this.collapsed);

      oldDOM.parentElement.replaceChild(this.dom, oldDOM);

      event.stopPropagation();
   }.bind(this));

   if (this.collapsed) {
      for (c in this.childTests) {
         this.childTests[c].destroy();
      }
   } else {
      // Tests
      domTests = this.dom.querySelector('div#tests');

      this.childTests = this.getChildTests();

      for (t in this.childTests) {
         domTests.appendChild(this.childTests[t].getDOM());
      }

      // Promises tests
      domTests = this.dom.querySelector('div#thenTests');

      this.thenTests = this.getThenTests();

      for (t in this.thenTests) {
         domTests.appendChild(this.thenTests[t].getDOM());
      }
   }
};

/**
 * Destroy the DOM Test.
 * Basically, this means that all references of the object should be deleted and the dom too.
 * The same should be done for his childrens
 */
DOMTest.prototype.destroy = function destroy() {

   var /** @type {number} */c;

   this.test.setDOM(undefined);

   if (this.dom !== undefined) {
      if (this.dom.parentElement !== null && this.dom.parentElement !== undefined) {
         this.dom.parentElement.removeChild(this.dom);
      }

      this.dom = undefined;
   }

   for (c in this.childTests) {
      this.childTests[c].destroy();
   }
};

/**
 * Return the DOM of the template
 * @param {boolean} [collapsed=false]
 * @returns {HTMLElement}
 */
DOMTest.prototype.getDOM = function getDOM(collapsed) {
   collapsed = collapsed === undefined ? this.collapsed : !!collapsed;

   if (this.dom === undefined || collapsed !== this.collapsed) this.buildDOM(collapsed);

   return this.dom;
};

/**
 * Return the data expected for the template
 * @returns {TestTemplateData}
 */
DOMTest.prototype.getTemplateData = function getTemplateData() {

   var /** @type {number} */duration, /** @type {number} */endTime, /** @type {number} */fails, /** @type {number} */startTime;

   startTime = this.test.getStartTime();
   endTime = this.test.getEndTime();

   if (endTime !== undefined) duration = (endTime - startTime) / 1000;

   fails = this.test.countFailedTests();

   return { async: this.test.async,
      collapsed: this.collapsed,
      comments: this.test.getComments(),
      description: this.test.getDescription(),
      duration: duration,
      endTime: common.time2string(endTime),
      errors: this.test.errors.slice(0),
      isGroup: this.test.isGroup(),
      lang: _lang2.default.test,
      notes: this.test.getNotes(),
      result: this.test.getResult(),
      severalFails: fails > 1,
      startTime: common.time2string(startTime),
      strict: this.test.strictMode,
      success: this.test.isSuccessful(),
      thens: this.test.getNexts(),
      title: this.test.getTitle(),
      toDoList: this.test.getToDoList(),
      totalFails: fails,
      totalSuccesses: this.test.countSuccessfulTests(),
      totalTests: this.test.countTotalTests() };
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @returns {TestUnit}
 */
DOMTest.prototype.getTest = function getTest() {
   return this.test;
};

/**
 * @returns {Array.<DOMSection|DOMTest>}
 */
DOMTest.prototype.getChildTests = function getTests() {
   var /** @type {Array.<DOMSection|DOMTest>} */domTests, /** @type {Section[]}                  */sections, /** @type {number}                     */t, /** @type {Array.<TestUnit|Section>}   */tests;

   if (this.test.sections[0].isDefault()) {
      tests = this.test.sections[0].getTests();
      sections = this.test.getSections();
      sections.shift();
   } else {
      tests = this.test.getSections();
   }

   domTests = [];
   tests = tests.concat(sections);

   for (t in tests) {

      if (tests[t].getDOM() !== undefined) domTests.push(tests[t].getDOM());else if (tests[t] instanceof _Section2.default) domTests.push(new _DOMSection2.default(tests[t]));else domTests.push(new DOMTest(tests[t]));
   }

   return domTests;
};

/**
 *
 */
DOMTest.prototype.getThenTests = function getThenTests() {
   var /** @type {DOMTest[]}  */domTests, /** @type {number}     */t, /** @type {TestUnit[]} */tests;

   domTests = [];

   tests = this.test.getNexts();

   for (t in tests) {
      domTests.push(new DOMTest(tests[t]));
   }

   return domTests;
};

/**
 *
 * Lang values :
 *    - startDate
 *    - endDate
 *    - duration
 *    - second
 *    - countTotal
 *    - countSuccess
 *    - countFail
 *    - yes
 *    - no
 *
 * @typedef {Object} TestTemplateData
 * @property {boolean}         async
 * @property {boolean}         collapsed    - If true, then add the class "collapsed" to the div.
 * @property {string}          description  - Description of the section
 * @property {string}          duration     - Duration (in second) of the total execution time
 * @property {string}          endTime      - End date of the latest test of the section
 * @property {Object.<string>} lang         - Local data
 * @property {boolean}         result       - Result of the unit test. true : the unit test is successful. false otherwise
 * @property {string}          startTime    - Date of the first test
 * @property {boolean}         strict       - Indicate weither (true) or not (false) the test is in strict mode
 * @property {boolean}         success      - If true, then the test, the child tests and the sibling tests are successful. False otherwise
 * @property {string}          title        - Title of the section
 * @property {number}          totalFails   - Total number of failed tests
 * @property {number}          totalSuccess - Total number of successful tests
 * @property {number}          totalTests   - Total number of testes
 */

/**
 *
 * @returns {string}
 */
DOMTest.prototype.getTemplate = function getTemplate() {

   return '<div class="test {{#success}}pass{{/success}}{{^success}}fail{{/success}} {{#collapsed}}collapsed{{/collapsed}} {{#isGroup}}group{{/isGroup}} {{#severalFails}}severalFails{{/severalFails}}">' + '<header>' + '<div id="title">{{#title}}{{title}}{{/title}}{{^title}}<span style="font-style: italic">no title</span>{{/title}}</div>' + '<div id="description">{{{description}}}</div>' + '<div id="fails">{{totalFails}}</div>' + '<div id="successes">{{totalSuccesses}}</div>' + '<div id="countTests">{{totalTests}}</div>' + '<div id="successesByTests">{{totalSuccesses}}/{{totalTests}}</div>' + '{{#errors}}<div class="errorReason">{{{.}}}</div>{{/errors}}' + '{{#toDoList}}<div class="todo">{{{.}}}</div>{{/toDoList}}' + '{{#comments}}<div class="comment">{{{.}}}</div>{{/comments}}' + '{{#notes}}<div class="note">{{{.}}}</div>{{/notes}}' + '</header>' + '<div id="tests"></div>' + '<div id="thenTests"></div>' + '</div>';
};

/**
 * Refresh the test.
 */
DOMTest.prototype.refresh = function buildHeader() {
   var /** @type {HTMLElement} */dom;

   if (this.dom === undefined) return;

   dom = this.dom;
   this.buildDOM(this.collapsed);

   dom.parentElement.replaceChild(this.dom, dom);
};

exports.default = DOMTest;


},{"./DOMSection":3,"./Section":6,"./common":10,"./lang":12}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMProject = require('./DOMProject');

var _DOMProject2 = _interopRequireDefault(_DOMProject);

var _TestUnit = require('./TestUnit');

var _TestUnit2 = _interopRequireDefault(_TestUnit);

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

/**
 *
 * @constructor
 * @class Project
 * @extends TestUnit
 * @property {string[]}    authors
 * @property {string}      description
 * @property {string}      name
 */
var Project = function Project(name) {
   _TestUnit2.default.call(this, { project: this, title: name });

   this.name = !name ? 'Test' : name;
   this.authors = [];
   this.domProject = new _DOMProject2.default(this);
};

Project.prototype = Object.create(_TestUnit2.default.prototype);
//noinspection JSUnusedGlobalSymbols
Project.prototype.constructor = Project;

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} author
 */
Project.prototype.addAuthor = function (author) {
   this.authors.push(author);
};

/**
 *
 * @param {string|HTMLElement} [location='body']
 * @returns {Promise}
 */
Project.prototype.display = function (location) {

   location = location ? location : 'body';

   document.addEventListener("DOMContentLoaded", function () {
      this.domProject.display(location);
   }.bind(this));
};

/**
 *
 * @returns {string[]}
 */
Project.prototype.getAuthors = function () {
   return this.authors.slice(0);
};

/**
 *
 * @param {Date} date
 * @returns {number|undefined}
 */
Project.prototype.getTime = function (date) {
   if (date === undefined) return undefined;
   return date - this.getStartDate();
};

/**
 *
 * @returns {boolean}
 */
Project.prototype.isUnitTest = function () {
   return false;
};

Project.prototype.isValid = function () {
   return true;
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {string} title
 */
Project.prototype.setTitle = function (title) {
   this.title = title;
};

exports.default = Project;


},{"./DOMProject":2,"./TestUnit":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});
/**
 *
 * @type {Promise}
 */
var promiseResolved = Promise.resolve();

/**
 *
 * @param {Project} project
 * @param {string}  [title]        Title of the section
 * @param {boolean} defaultSection If true, then this section is the default section of the parent
 * @param {TestUnit} parent
 * @constructor
 * @class Section
 * @extend Promise
 * @property {boolean|undefined}   _isSuccessful
 * @property {boolean|undefined}   asyncTests
 * @property {boolean}             defaultSection
 * @property {DOMSection}          domSection
 * @property {string}              description
 * @property {boolean}             _hasFinished
 * @property {TestUnit[]}          tests
 * @property {string}              title
 */
var Section = function Section(project, title, defaultSection, parent) {

   this.id = Section.maxID++;
   this.title = title;
   this.tests = [];
   this.project = project;
   this.parent = parent;
   this.defaultSection = defaultSection;

   this.results = { count: { errors: 0,
         fails: 0,
         successes: 0,
         total: 0 } };
};

/**
 *
 * @param {TestUnit} test
 */
Section.prototype.addTest = function addTest(test) {

   var /** @type {TestUnit|Section} */parent;

   this.tests.push(test);

   /*this.then(function() {
      return test;
   });*/

   if (this.asyncTests === false) {
      if (test.hasAsyncTests()) {
         this.asyncTests = true;

         parent = this.parent;

         // Updating parents : we all the parents who call the
         while (parent !== undefined && (parent ? parent : {}).asyncTests !== true) {
            parent.asyncTests = true;
            parent = parent.parent;
         }
      }
   }

   // Updating section by adding tests counts
   this.refresh();
};

/**
 *
 * @param {number} [deltaErrors]
 * @param {number} [deltaFails]
 * @param {number} [deltaSuccesses]
 * @param {number} [deltaTotal]
 */
Section.prototype.refresh = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {
   var /** @type {number} */errors, /** @type {number} */fails, /** @type {number} */successes, /** @type {number} */t, /** @type {number} */total;

   if (deltaTotal !== undefined && this.results.count.fails !== undefined) {
      this.results.count.errors += deltaErrors;
      this.results.count.fails += deltaFails;
      this.results.count.successes += deltaSuccesses;
      this.results.count.total += deltaTotal;
   } else {
      errors = this.results.count.errors;
      fails = this.results.count.fails;
      successes = this.results.count.successes;
      total = this.results.count.total;

      this.results.count.errors = 0;
      this.results.count.fails = 0;
      this.results.count.successes = 0;
      this.results.count.total = 0;

      for (t in this.tests) {
         this.results.count.errors += this.tests[t].countErrors();
         this.results.count.fails += this.tests[t].countFailedTests();
         this.results.count.successes += this.tests[t].countSuccessfulTests();
         this.results.count.total += this.tests[t].countTotalTests();
      }

      if (this.results.count.total !== undefined) {
         deltaErrors = errors - this.results.count.errors;
         deltaFails = fails - this.results.count.fails;
         deltaSuccesses = successes - this.results.count.successes;
         deltaTotal = total - this.results.count.total;
      }
   }

   if (this.parent !== undefined) if (this.parent.results.count.total !== undefined) this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);

   if (this.getDOM()) this.getDOM().refresh();
};

/**
 *
 * @param {boolean} failedOnly
 */
Section.prototype.console = function (failedOnly) {

   var /** @type {number} */successes, /** @type {number} */t, /** @type {number} */total;

   successes = this.countSuccessfulTests();
   total = this.countTotalTests();

   nonStrictFunction.groupCollapsed((this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail') + ' : ' + successes + '/' + total);

   for (t in this.tests) {

      if (failedOnly) if (this.tests[t].isSuccessful()) continue;

      this.tests[t].console(failedOnly);
   }

   nonStrictFunction.groupEnd();
};

/**
 * Return the total number of errors that hasn't been handled
 * @returns {number}
 */
Section.prototype.countErrors = function () {
   return this.results.count.errors;
};

/**
 * Return the number of failed tests inside the section
 * @returns {number}
 */
Section.prototype.countFailedTests = function countFailedTests() {
   return this.results.count.fails;
};

/**
 *
 * @returns {number}
 */
Section.prototype.countSuccessfulTests = function countSuccessfulTests() {
   return this.results.count.successes;
};

/**
 *
 * @returns {number}
 */
Section.prototype.countTotalTests = function countTotalTests() {
   return this.results.count.total;
};

//noinspection ReservedWordAsName
/**
 *
 * @returns {Promise}
 */
Section.prototype.catch = function () {
   this._hasFinished = false;
   return Promise.prototype.catch.apply(this.getPromise(), arguments);
};

//noinspection JSUnusedGlobalSymbols
/**
 * @param {string} description
 */
Section.prototype.describe = function describe(description) {
   this.description = description;
};

/**
 * @returns {Promise}
 */
Section.prototype.getPromise = function getPromise() {

   if (this.promise === undefined) this.promise = promiseResolved;

   return this.promise;
};

/**
 *
 * @return {Promise}
 */
Section.prototype.getCompletedPromise = function getCompletedPromise() {

   var /** @type {number} */i, /** @type {Promise[]} */promises;

   promises = [];
   for (i in this.tests) {
      promises.push(this.tests[i].getCompletedPromise());
   }

   return Promise.all(promises);
};

/**
 *
 * @param {boolean} [failedOnly=false]
 * @returns {SectionExport}
 */
//noinspection ReservedWordAsName
Section.prototype.getData = function getData(failedOnly) {

   var /** @type {number}      */t, /** @type {TestUnit[]} */tests;

   tests = [];
   failedOnly = failedOnly === undefined ? false : failedOnly;

   for (t in this.tests) {

      if (failedOnly) if (this.tests[t].isSuccessful()) continue;

      tests.push(this.tests[t].getData());
   }

   return { tests: tests,
      title: this.title
   };
};

/**
 *
 * @returns {string}
 */
Section.prototype.getDescription = function getDescription() {
   return this.description;
};

/**
 *
 * @returns {DOMSection}
 */
Section.prototype.getDOM = function getDOM() {
   return this.domSection;
};

/**
 * @returns {Date}
 */
Section.prototype.getEndDate = function getEndDate() {
   if (this.tests.length === 0) return undefined;

   this.tests[this.tests.length - 1].getEndDate();
};

/**
 *
 * @returns {number|undefined}
 */
Section.prototype.getEndTime = function getEndTime() {
   return this.project.getTime(this.getEndDate());
};

/**
 * @returns {Date}
 *
 */
Section.prototype.getStartDate = function getStartDate() {
   if (this.tests.length === 0) return undefined;

   return this.tests[0].getStartDate();
};

/**
 *
 * @returns {number}
 */
Section.prototype.getStartTime = function getStartTime() {
   return this.project.getTime(this.getStartDate());
};

/**
 *
 * @returns {TestUnit[]}
 */
Section.prototype.getTests = function getTests() {
   return this.tests.slice(0);
};

/**
 * Return the title of the section
 * @returns {string|undefined}
 */
Section.prototype.getTitle = function getTitle() {
   return !this.title ? '' : this.title;
};

/**
 *
 * @returns {boolean}
 */
Section.prototype.hasAsyncTests = function hasAsyncTests() {

   var /** @type {number} */t;

   if (this.asyncTests !== undefined) return true;

   for (t in this.tests) {
      if (this.tests[t].hasAsyncTests()) {
         this.asyncTests = true;
         return true;
      }
   }

   return false;
};

Section.prototype.hasFinished = function hasFinished() {
   var /** @type {number} */i;

   if (this._hasFinished) return this._hasFinished;

   for (i in this.tests) {
      if (!this.tests[i].hasFinished()) return false;
   }

   this._hasFinished = true;

   return this._hasFinished;
};

/**
 *
 * @returns {boolean}
 */
Section.prototype.isDefault = function isDefault() {
   return this.defaultSection;
};

/**
 *  @returns {boolean}
 */
Section.prototype.isSuccessful = function isSuccessful() {
   var /** @type {number}  */i;

   if (!this.hasFinished()) return false;

   for (i in this.tests) {
      if (!this.tests[i].isSuccessful()) return false;
   }

   return true;
};

/**
 * @param {DOMSection} dom
 */
Section.prototype.setDOM = function setDOM(dom) {
   this.domSection = dom;
};

/**
* @returns {Promise}
*/
Section.prototype.then = function () {
   this._hasFinished = false;
   return Promise.prototype.then.apply(this.getPromise(), arguments);
};

Section.maxID = 0;

exports.default = Section;


},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _private = require('./private');

/**
 *
 * @param {TestUnit} test
 * @constructor
 * @class TestExecution
 * @property {TestContext} childContext
 * @property {Date}     startDate
 * @property {Date}     endDate
 * @property {function} executionFunction
 * @property {TestUnit} test
 */
var TestExecution = function TestExecution(test) {
   this.test = test;
   this.testFunction = this.test.getTestFunction();
   this.childContext = this.test.childContext;
   this.async = this.test.async;
   this.context = this.test.context;
};

TestExecution.prototype.done = function done() {
   this.endDate = new Date();
};

/**
 * Execute the function
 */
TestExecution.prototype.execute = function execute() {

   var /** @type {*}                   */err, /** @type {ThisTestContextInfo} */oldInfo, /** @type {Array}               */params;

   // Building parameters for the function :
   // The first parameter is the "test" function
   // The second parameter is the first argument provided to the execute function.
   params = [this.test.childContext];

   if (arguments.length === 1) params.push(arguments[0]);

   // We have to change the context of the "test" function
   oldInfo = this.context.info;

   //noinspection JSValidateTypes
   this.context.reset(_private.token, this.childContext._info(_private.token));

   this.startDate = new Date();
   try {
      this.result = this.testFunction.apply(undefined, params);
   } catch (err) {
      this.throwError = true;
      this.error = err;
   }

   if (this.result instanceof Promise) {
      this.result.then(function (result) {
         // Note : endDate could be already defined if the "done" function has been triggered
         this.endDate = this.endDate === undefined ? new Date() : this.endDate;
         this.result = result;
         return this.result;
      }.bind(this), function (error) {
         this.endDate = this.endDate === undefined ? new Date() : this.endDate;
         this.throwError = true;
         this.error = error;
      }.bind(this));
   } else
      // Note : endDate could be already defined if the "done" function has been triggered
      this.endDate = this.endDate === undefined ? new Date() : this.endDate;

   this.context.reset(_private.token, oldInfo);

   return this.result;
};

/**
 * Indicate if the test function (and it's eventual return promises) has finished (true) or not (false)
 * @returns {boolean}
 */
TestExecution.prototype.hasFinished = function hasFinished() {
   return this.endDate !== undefined;
};

/**
 * Return the duration of the execution.
 * If the test hasn't finished, then return undefined.
 * @param {boolean} [untilNow=false] If true, then if will use the current date instead of the end date if the function hasn'nt finished yet
 * @returns {number|undefined}
 */
TestExecution.prototype.getDuration = function getDuration(untilNow) {

   var /*** @type {number} */endDate;

   endDate = this.endDate !== undefined ? this.endDate : untilNow ? Date.now() : undefined;

   if (endDate === undefined) return undefined;

   return endDate - this.startDate;
};

/**
 *
 * @returns {Date}
 */
TestExecution.prototype.getEndDate = function getEndDate() {
   return this.endDate;
};

/**
 *
 * @returns {Date}
 */
TestExecution.prototype.getStartDate = function getStartDate() {
   return this.startDate;
};

exports.default = TestExecution;


},{"./private":14}],8:[function(require,module,exports){
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


},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _TestExecution = require('./TestExecution');

var _TestExecution2 = _interopRequireDefault(_TestExecution);

var _TestType = require('./TestType');

var _TestType2 = _interopRequireDefault(_TestType);

var _common = require('./common');

var _functions = require('./functions');

function _interopRequireDefault(obj) {
   return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * @param {TestUnitParameters} param
 * @constructor
 * @class TestUnit
 * @extend {Promise.<R>}
 * @property {boolean|undefined} _hasFinished         - Indicate weither (true) or not (false) the test, and all it's child tests have end
 * @property {boolean}           _hasUnitTestFinished
 * @property {boolean}           _isClosed            - If true, the the test is closed. False other wise. A closed test can't have new child tests
 * @property {boolean}           async
 * @property {boolean|undefined} asyncTests
 * @property {TestUnit[]}        catchTests           - List of all "catch" tests
 * @property {TestContext}       childContext
 * @property {string}            comment
 * @property {boolean}           calculated
 * @property {boolean}           completed
 * @property {Date}              creationDate         - Date of creation of the test
 * @property {string}            description
 * @property {DOMTest}           domTest
 * @property {boolean}           durationResult
 * @property {boolean}           enabled
 * @property {boolean}           errorExpected
 * @property {function}          fullfillPromise      - Fullfill function of the test promise : it will be executed by the fullfillTest function
 * @property {TestUnit[]}        nexts                - Test executed right after this one, using the then/catch function
 * @property {boolean}           notMode
 * @property {TestUnit|Section}  parent
 * @property {Project}           project
 * @property {Promise}           promise
 * @property {string|undefined}  promiseRole
 * @property {function}          promiseThenFunction  - Original "then" function of the promise.
 * @property {function}          rejectPromise        - Reject function of the test promise : it will be executed by the reject test function
 * @property {boolean}           result
 * @property {Section[]}         sections
 * @property {boolean}           strictMode
 * @property {TestExecution}     testExecution
 * @property {function}          testFunction
 * @property {Array}             testParameters       - The parameter to provide to the testing function (ex: [10] for the "toBeGreaterThan" test)
 * @property {Array}             testParametersExport - Copy of the testParameter attribute that will be used for the export.
 * @property {TestType}          testType
 * @property {number|undefined}  timeout              - If provided, then correspond to the maximum duration of the test function. After that, the test will be considered has failed
 * @property {string}            promiseRole          - Role of the test relatively to the parent test promise. Could be undefined, "then" or "catch".
 * @property {string[]}          toDoList             - Contain all todos
 * @property {string}            title
 */
var TestUnit = function TestUnit(param) {

   this.catchTests = [];
   this.calculated = false;
   this.comments = [];
   this.completed = false;
   this.context = param.context;
   this.creationDate = new Date();
   this.enabled = param.enabled;
   this.id = TestUnit.lastId++;
   this.nexts = [];
   this.notMode = false;
   this.parent = param.parent;
   this.promiseRole = param.promiseRole;
   this.project = param.project;
   this.timeout = param.timeout;
   this.strictMode = param.strict;
   this.tests = [];
   this.title = param.title;
   this.value = param.value;
   this.executionDelay = param.executionDelay;
   this.errorExpected = false;
   this.toDoList = [];
   this.errors = [];
   this.testType = undefined;

   this.notes = [];

   this.async = param.async || this.executionDelay !== false || this.value instanceof Promise || this.value instanceof TestUnit;

   this._isClosed = false;

   this.results = { error: undefined,
      test: undefined,
      timeout: undefined,
      validity: undefined

      // Theses are the values return by the "count" functions. They are updated by the "refresh" function.
      , count: { errors: 0,
         fails: 0,
         successes: 0,
         total: 0 } };

   // Child tests
   this.childContext = (0, _Context2.default)(this);
   this.currentSection = new _Section2.default(this.project, '', true, this);
   this.sections = [this.currentSection];

   if (typeof this.value === 'function') {
      this.testFunction = this.value;
      this.testExecution = new _TestExecution2.default(this);
   }

   if (!this.enabled) return;

   this.buildPromise();

   this.execute();
};

/**
 *
 * @returns {Promise}
 */
TestUnit.prototype.buildPromise = function buildPromise() {

   var /** @type {string}  */name;

   this.promise = new Promise(function (fullfill, reject) {
      this.fullfillPromise = fullfill;
      this.rejectPromise = reject;
   }.bind(this));

   this.promiseThenFunction = this.promise.then.bind(this.promise);

   for (name in _TestType2.default.all) {
      this.promise[name] = _functions.buildTest_execute.bind({ test: this, type: _TestType2.default.all[name], promise: this.promise });
   }

   this.promise.todo = this.todo.bind(this);
   this.promise.comment = this.comment.bind(this);
   this.promise.describe = this.describe.bind(this);
   this.promise.note = this.note.bind(this);
   this.promise.getResult = this.getResult.bind(this);
   this.promise.then = this.then.bind(this);
   this.promise.catch = this.catch.bind(this);

   // Adding the "not" keyword
   Object.defineProperty(this.promise, 'not', { get: function () {
         this.not();return this.promise;
      }.bind(this) });

   this.promise.$ = this;
};

/**
 * Calculate the result of the test
 */
TestUnit.prototype.calcResult = function calcResult() {

   var /** @type {Array}    */params, /** @type {boolean}  */result, /** @type {TestType} */testType, value;

   if (this.errorExpected) value = this.error;else value = this.value;

   testType = this.testType ? this.testType : _TestType2.default.all.isTrue;

   if (!this.isUnitTest()) {
      this.results.validity = this.isValid();
      this.calculated = true;
      return;
   }

   this.results.validity = true;

   // Creating parameters list for the test function
   params = [value].concat(this.testParameters);

   // If no errors has been raised, then we continue
   if (this.results.error && !this.errorExpected) result = false;else if (this.errorExpected && !this.results.error) result = false;else {

      try {
         if (this.strictMode && testType.strictTest !== undefined) result = testType.strictTest.apply(undefined, params);else result = testType.test.apply(undefined, params);
      } catch (e) {
         result = false;
      }

      if (this.notMode) result = !result;
   }

   this.results.test = result;
   this.calculated = true;
};

/**
 *
 * Function to execute after the test.
 *
 * If the first parameter is a string, then a new test will be created with the string
 * as title and the second parameter as the test. In this case, the function will return
 * the newly created test unit
 * Note that in this case, if we are an sync test, the "then" test will be executed synchronously.
 *
 * If the first parameter isn't a string, then the standard "then" function of promise pattern
 * will be called. The function will return the newly created promise.
 *
 * @param {string|function} param1
 * @param {function}        [param2]
 * @returns {TestPromise}
 */
TestUnit.prototype['catch'] = function (param1, param2) {
   if (arguments.length === 1) return this.then(undefined, param1);else return this.then(param1, undefined, param2);
};

/**
 *
 * @param {string} comment
 * @returns {TestUnit}
 */
TestUnit.prototype.comment = function comment(comment) {
   this.comments.push(comment);
   return this.getPromise();
};

/**
 *
 * @param {boolean} isError
 * @param {*}       value
 */
TestUnit.prototype.complete = function complete(isError, value) {

   this.completed = true;

   if (!isError && this.testExecution) {
      isError = this.testExecution.throwError;

      if (isError) value = this.testExecution.error;
   }

   if (isError) {
      this.error = value;
      this.results.error = true;
   } else {
      this.value = value;
   }

   this.refresh();
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @param {boolean} [failedOnly=false]
 * @returns {TestUnit}
 */
TestUnit.prototype.console = function console(failedOnly) {

   var /** @type {string}  */logText, /** @type {number}  */s, /** @type {number}  */successes, /** @type {number}  */total;

   failedOnly = undefined ? false : failedOnly;

   successes = this.countSuccessfulTests();
   total = this.countTotalTests();

   logText = (this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail');

   if (total > 1) {
      logText += ' - ' + successes + '/' + total;
      _common.nonStrictFunction.groupCollapsed(logText);

      if (this.sections.length > 1) {
         for (s in this.sections) {

            if (failedOnly) if (this.sections[s].isSuccessful()) continue;

            if (this.sections[s].countTotalTests() === 0) continue;

            this.sections[s].console(failedOnly);
         }
      } else {

         for (s in tests) {
            if (failedOnly) if (tests[s].isSuccessful()) continue;

            this.sections[0].tests[s].console();
         }
      }

      _common.nonStrictFunction.groupEnd();
   } else {

      if (this.isSuccessful()) _common.nonStrictFunction.log(logText);else _common.nonStrictFunction.warn(logText);
   }

   return this;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countErrors = function countError() {
   return this.results.count.errors;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countFailedTests = function countFailedTests() {
   return this.results.count.fails;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countSuccessfulTests = function countSuccessfulTests() {
   return this.results.count.successes;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countTotalTests = function countTotalTests() {
   return this.results.count.total;
};

/**
  *
  * @param {string} description
  */
TestUnit.prototype.describe = function describe(description) {
   this.description = description;
   return this.promise;
};

/**
 * Function executed to indicate that the async function has finished.
 * This function is relevant only if the async call has been made by providing a timeout.
 * If so, then a test will be done : the difference between the start of the test function and the execution of the done function
 * must be lesser than the timeout provided initially.
 *
 */
TestUnit.prototype.done = function done() {
   this.testExecution.done();
   return this.getPromise();
};

/**
 * Execute the unit test
 * TODO : This function could by simplify
 *
 */
TestUnit.prototype.execute = function execute() {
   var /** @type {function} */fullfillFunction, /** @type {Promise}  */promise, /** @type {function} */rejectFunction, /** @type {function} */thenFunction;

   if (!this.enabled) return;

   if (this.async || this.value instanceof Promise) {

      // The value is a promise
      if (this.value.$ instanceof TestUnit) {

         thenFunction = function () {
            return this.value.$.getResult();
         }.bind(this);

         promise = this.value.$.promiseThenFunction(thenFunction, thenFunction);
      } else if (this.value instanceof Promise) {
         promise = this.value;
      }

      // Test using the "delay" function
      else if (this.executionDelay !== false) {

            promise = new Promise(function (fullfill, reject) {
               fullfillFunction = fullfill;
               rejectFunction = reject;
            });

            setTimeout(function () {
               try {
                  fullfillFunction(this.testExecution.execute(this.value));
               } catch (err) {
                  rejectFunction(err);
               }
            }.bind(this), this.executionDelay);
         }

         // Standard "async" call
         else if (this.promiseRole === undefined) {

               promise = Promise.resolve().then(function () {
                  return this.testExecution.execute(this.value);
               }.bind(this));
            }

            // Test call by a "then" function
            else if (this.promiseRole === 'then') promise = this.parent.promiseThenFunction(function (value) {
                  return this.testExecution.execute(value);
               }.bind(this));

               // Test call by a "catch" function
               else promise = this.parent.promiseThenFunction(undefined, function (error) {
                     return this.testExecution.execute(error);
                  }.bind(this));
   } else if (this.testFunction) {
      this.value = this.testExecution.execute();

      if (this.value instanceof Promise) promise = this.value;
   }

   if (promise !== undefined) {

      if (promise.$ instanceof TestUnit) {
         promise.$.promiseThenFunction(function (value) {
            this.complete(false, value);
         }.bind(this), function (error) {
            this.complete(true, error);
         }.bind(this));
      } else {
         promise.then(function (value) {
            this.complete(false, value);
         }.bind(this), function (error) {
            this.complete(true, error);
         }.bind(this));
      }
   } else this.complete(false, this.value);
};

/**
 *
 * @returns {string[]}
 */
TestUnit.prototype.getComments = function getComments() {
   return this.comments.slice(0);
};

/**
 * Return the promise that will be executed once all the test and sub-tests (including promises tests) are finished
 *
 * @returns {Promise}
 */
TestUnit.prototype.getCompletedPromise = function getCompletedPromise() {

   var /** @type {number}    */i, /** @type {Promise[]} */promises;

   promises = [this.getPromise()];

   for (i in this.sections) {
      promises.push(this.sections[i].getCompletedPromise());
   }

   for (i in this.nexts) {
      promises.push(this.nexts[i].getCompletedPromise());
   }

   return Promise.all(promises);
};

/**
 * @param {boolean} [failedOnly=false]
 * @returns {TestUnitExport}
 */
TestUnit.prototype.getData = function getData(failedOnly) {

   var /** @type {Object}           */data, /** @type {number}           */n, /** @type {TestUnitExport[]} */nexts, /** @type {number}           */s;

   nexts = [];

   failedOnly = failedOnly === undefined ? false : failedOnly;

   for (n in this.nexts) {

      if (failedOnly) if (this.nexts[n].isSuccessful()) continue;

      nexts.push(this.nexts[n].getData(failedOnly));
   }

   data = { async: this.async,
      enabled: this.enabled,
      id: this.id,
      nexts: nexts,
      not: this.notMode,
      result: this.results.test,
      sections: [],
      strict: this.strictMode,
      testParameters: this.testParametersExport,
      title: this.title,
      type: 'TestUnit',
      value: this.value
   };

   for (s in this.sections) {

      if (failedOnly) if (this.sections[s].isSuccessful()) continue;

      // If the first section is empty, we skip it
      if (s == 0 && this.sections[s].countTotalTests() === 0) continue;

      data.sections.push(this.sections[s].getData(failedOnly));
   }

   if (this.testType) data['test'] = this.testType.code;

   return data;
};

/**
 *
 * @returns {string}
 */
TestUnit.prototype.getDescription = function getDescription() {
   return this.description;
};

/**
 *
 * @returns {boolean}
 */
TestUnit.prototype.getDurationResult = function getDurationResult() {
   return this.durationResult;
};

/**
 *
 * @returns {DOMTest}
 */
TestUnit.prototype.getDOM = function getDOM() {
   return this.domTest;
};

/**
 *
 * @returns {Date}
 */
TestUnit.prototype.getEndDate = function getEndDate() {
   if (this.testFunction) return this.testExecution.getEndDate();

   return this.creationDate;
};

/**
 *
 * @returns {number|undefined}
 */
TestUnit.prototype.getEndTime = function getEndTime() {
   this.getProject().getTime(this.getEndDate());
};

/**
 *
 * @returns {TestPromise}
 */
TestUnit.prototype.getPromise = function getPromise() {
   return this.promise;
};

/**
 *
 * @returns {Project}
 */
TestUnit.prototype.getProject = function getProject() {
   return this.project;
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @returns {TestUnit[]}
 */
TestUnit.prototype.getNexts = function getNexts() {
   return this.nexts.slice(0);
};

/**
 * Return all notes of the test
 * @returns {string[]}
 */
TestUnit.prototype.getNotes = function getNotes() {
   return this.notes.slice(0);
};

/**
 * Return the result of the test.
 * Do not take care of the timeout of the function nor the child tests
 *
 * @returns {boolean}
 */
TestUnit.prototype.getResult = function getResult() {
   if (this.results.test === false) return false;

   if (this.results.count.fails > 0) return false;

   if (this.results.validity === false) return false;

   return this.results.timeout !== false;
};

/**
 *
 * @returns {Section[]}
 */
TestUnit.prototype.getSections = function getSections() {
   return this.sections.slice(0);
};

/**
 *
 * @returns {Date}
 */
TestUnit.prototype.getStartDate = function getStartDate() {
   if (this.testFunction) return this.testExecution.getStartDate();

   return this.creationDate;
};

/**
 *
 * @returns {number|undefined}
 */
TestUnit.prototype.getStartTime = function getStartTime() {
   return this.getProject().getTime(this.getStartDate());
};

/**
 *
 * @returns {function}
 */
TestUnit.prototype.getTestFunction = function getTestFunction() {
   return this.testFunction;
};

/**
 *
 * @returns {string|undefined}
 */
TestUnit.prototype.getTitle = function getTitle() {
   return this.title;
};

/**
 *
 * @returns {Array.<string>}
 */
TestUnit.prototype.getToDoList = function getToDoList() {
   return this.toDoList.slice(0);
};

/**
 *
 * @returns {*}
 */
TestUnit.prototype.getValue = function getValue() {
   return this.value;
};

/**
 *
 * @returns {boolean}
 */
TestUnit.prototype.hasAsyncTests = function hasAsyncTests() {

   var /** @type {number} */n, /** @type {number} */s;

   if (this.asyncTests !== undefined) return this.asyncTests;

   if (this.async) {
      this.asyncTests = true;
      return true;
   }

   for (n in this.nexts) {
      if (this.nexts[n].hasAsyncTests()) {
         this.asyncTests = true;
         return true;
      }
   }

   for (s in this.sections) {
      if (this.sections[s].hasAsyncTests()) {
         this.asyncTests = true;
         return true;
      }
   }

   return false;
};

/**
 * Return true if the test as finished. False otherwise
 */
TestUnit.prototype.hasFinished = function hasFinished() {

   var /** @type {number} */n, /** @type {number} */s;

   if (this._hasFinished === true) return this._hasFinished;

   if (this.testFunction) {
      if (!this.testExecution.hasFinished()) return false;
   }

   for (s in this.sections) {
      if (!this.sections[s].hasFinished()) return false;
   }

   for (n in this.nexts) {
      if (!this.nexts[n].hasFinished()) return false;
   }

   this._hasFinished = true;
   return this._hasFinished;
};

/**
 * Indicate if the test function has finished in time.
 * If there is no test function then return true.
 * If there is no timeout defined, then return true.
 * If the function hasn't finished yet but has reached the timeout, then return false.
 * If the function hasn't finished but it's still respecting the timeout, then return undefined
 * @returns {boolean|undefined}
 */
TestUnit.prototype.hasFinishedInTime = function hasFinishedInTime() {

   if (!this.testFunction) return true;

   if (this.timeout === undefined) return true;

   if (this.testExecution.hasFinished()) return this.testExecution.getDuration() < this.timeout;

   return this.testExecution.getDuration(true) >= this.timeout ? false : undefined;
};

/**
 * Indicate if the test is closed (true) or not (false).
 * A test is closed if it has finished or as reached the timeout
 * @returns {boolean}
 */
TestUnit.prototype.isClosed = function isClosed() {
   if (this._isClosed === true) return true;

   if (this.hasFinished()) {
      this._isClosed = true;
      return true;
   }

   if (this.hasFinishedInTime() === false) {
      this._isClosed = true;
      return true;
   }
};

TestUnit.prototype.isGroup = function isGroup() {
   if (this.sections.length > 1) return true;

   if (this.nexts.length > 0) return true;

   return this.sections[0].getTests().length > 0;
};

/**
 * @returns {boolean}
 */
TestUnit.prototype.isSuccessful = function isSuccessful() {

   var /** @type {number} */s, /** @type {number} */t;

   if (this.getResult() === false) return false;

   for (s in this.sections) {
      if (!this.sections[s].isSuccessful()) return false;
   }

   for (t in this.nexts) {
      if (!this.nexts[t].isSuccessful()) return false;
   }

   return true;
};

/**
 * Return true if the test is a unit test, false otherwise.
 * The test is an unit test if a test type has been defined (ex: isTrue)
 * or if a test function as been defined an if this function returned a value (that is not a promise).
 * Note that if a timeout has been defined, then it's a test unit
 * @returns {boolean}
 */
TestUnit.prototype.isUnitTest = function isUnitTest() {

   // If there is no test function, then it's that a value has been provided
   //noinspection JSValidateTypes
   if (this.testFunction === undefined) return true;

   if (this.testType !== undefined) return true;

   if (this.timeout !== undefined) return true;

   //noinspection RedundantConditionalExpressionJS
   return this.value !== undefined && !(this.value instanceof Promise || this.value instanceof TestUnit) ? true : false;
};

/**
 * Indicate if the test is va valid test or not.
 * A test is invalid if it's not a unit test and if it didn't defined any other test/sections (no child tests, no promises tests)
 *
 * @returns {boolean}
 */
TestUnit.prototype.isValid = function isValid() {

   if (this.isUnitTest()) return true;

   return this.isGroup();
};

/**
 * Invert the sens of the test
 * @returns {TestPromise}
 */
TestUnit.prototype.not = function not() {
   this.notMode = true;
   return this.getPromise();
};

/**
 *
 * @param {string} note
 */
TestUnit.prototype.note = function note(note) {
   this.notes.push(note);
   return this.getPromise();
};

/**
 * Count the number of fails, successes and total testes.
 * @param {number} [deltaErrors]
 * @param {number} [deltaFails]
 * @param {number} [deltaSuccesses]
 * @param {number} [deltaTotal]
 *
 */
TestUnit.prototype.refresh = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {

   var /** @type {*}       */error, /** @type {number}  */errors, /** @type {number}  */fails, /** @type {boolean} */hasFinishedInTime, /** @type {number}  */s, /** @type {number}  */successes, /** @type {number}  */t, /** @type {number}  */total;

   if (this.completed && !this.calculated) {

      if (this.results.error) {
         this.calculated = true;
         this.rejectPromise(this.error);
      }

      if (!this.results.error || this.errorExpected) {
         try {
            this.calcResult();
            if (!this.results.error) this.fullfillPromise(this.value);
         } catch (error) {
            this.error = error;
            this.results.error = true;
            this.rejectPromise(this.error);
         }
      }
   }

   // We refresh only if counts have already been done
   if (this.results.count.total === undefined) return;

   if (deltaTotal !== undefined && this.results.count.total !== undefined) {
      this.results.count.deltaErrors += deltaErrors;
      this.results.count.fails += deltaFails;
      this.results.count.successes += deltaSuccesses;
      this.results.count.total += deltaTotal;
      this.results.count.isValid = this.isValid();
   } else {

      this.errors = [];

      // Calculating validity only if the test was previously invalid
      // Note : a valid test can't become invalid (because a invalid test is basically a test without results nor sub tests).
      if (!this.results.validity) this.results.validity = this.isValid();

      // Errors
      errors = 0;
      if (this.results.error && !this.errorExpected) {
         errors += 1;
         this.errors.push('The test has raised an exception');
      } else if (!this.results.error && this.errorExpected) {
         errors += 1;
         this.errors.push('The test should have raise an exception');
      }

      // Fails
      fails = this.isUnitTest() && !this.results.test ? 1 : 0;
      fails += errors;
      fails += !this.results.validity ? 1 : 0;

      if (this.isUnitTest() && !this.results.test) this.errors.push('The test has failed');

      if (!this.results.validity) this.errors.push('Not a valid test');

      hasFinishedInTime = this.hasFinishedInTime();

      if (hasFinishedInTime !== undefined && !hasFinishedInTime) fails += 1;

      // Successes
      successes = this.isUnitTest() && this.results.test ? 1 : 0;
      successes += this.timeout !== undefined && this.results.timeout ? 1 : 0;

      if (this.testFunction && this.timeout !== undefined) {
         // Note : if the test hasn't finished in time, then we have another fail
         hasFinishedInTime = this.hasFinishedInTime();

         if (hasFinishedInTime !== undefined && !hasFinishedInTime) successes += 1;
      }

      // Total
      total = this.isUnitTest() ? 1 : 0;
      total += this.timeout !== undefined;

      for (s in this.sections) {
         errors += this.sections[s].countErrors();
         fails += this.sections[s].countFailedTests();
         successes += this.sections[s].countSuccessfulTests();
         total += this.sections[s].countTotalTests();
      }

      for (t in this.nexts) {
         errors += this.nexts[s].countErrors();
         fails += this.nexts[t].countFailedTests();
         successes += this.nexts[t].countSuccessfulTests();
         total += this.nexts[t].countTotalTests();
      }

      if (this.results.count.total !== undefined) {
         deltaErrors = errors - this.results.count.errors;
         deltaFails = fails - this.results.count.fails;
         deltaSuccesses = successes - this.results.count.successes;
         deltaTotal = total - this.results.count.total;
      }

      this.results.count = { errors: errors,
         fails: fails,
         successes: successes,
         total: total };
   }

   if (this.parent !== undefined) {
      if (this.parent.results.count.total !== undefined) this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);
   }

   if (this.getDOM()) this.getDOM().refresh();
};

/**
 *
 * @param {DOMTest} dom
 */
TestUnit.prototype.setDOM = function setDOM(dom) {
   this.domTest = dom;
};

/**
 *
 * Function to execute after the test.
 *
 * If the first parameter is a string, then a new test will be created with the string
 * as title and the second parameter as the test. In this case, the function will return
 * the newly created test unit
 * Note that in this case, if we are an sync test, the "then" test will be executed synchronously.
 *
 * If the first parameter isn't a string, then the standard "then" function of promise pattern
 * will be called. The function will return the newly created promise.
 *
 * @param {string|function} param1
 * @param {function}        [param2]
 * @param {function}        [param3]
 * @returns {TestPromise}
 */
TestUnit.prototype.then = function then(param1, param2, param3) {

   var /** @type {function} */catchFunction, /** @type {TestUnit} */catchTest, /** @type {function} */thenFunction, /** @type {TestUnit} */thenTest, /** @type {string}   */title;

   // .then(fct, fct);
   // .then(fct);
   // .then(undefined, fct);
   // .then('test', undefined, fct);
   // .then(undefined, undefined, fct);

   if (arguments.length === 1) {
      title = undefined;
      thenFunction = param1;
   } else if (arguments.length == 2) {
      if (typeof param1 === 'string') {
         title = param1;
         thenFunction = param2;
      } else {
         title = undefined;
         thenFunction = param1;
         catchFunction = param2;
      }
   } else if (arguments.length === 3) {
      title = param1;
      thenFunction = param2;
      catchFunction = param3;
   }

   if (thenFunction != undefined) {
      thenTest = new TestUnit({ async: true,
         context: this.childContext,
         enabled: this.enabled,
         executionDelay: false,
         strict: this.strictMode,
         parent: this,
         project: this.getProject(),
         promiseRole: 'then',
         title: title,
         value: thenFunction });

      this.nexts.push(thenTest);
   }

   if (catchFunction != undefined) {
      catchTest = new TestUnit({ async: true,
         context: this.childContext,
         enabled: this.enabled,
         executionDelay: false,
         strict: this.strictMode,
         parent: this,
         project: this.getProject(),
         promiseRole: 'catch',
         title: title,
         value: catchFunction });

      this.catchTests.push(catchTest);
   }

   this.refresh();

   if (thenTest != undefined) return thenTest.getPromise();else return catchTest.getPromise();
};

TestUnit.prototype.todo = function todo(text) {
   this.toDoList.push(text);
   return this.getPromise();
};

/**
 *
 * @returns {string}
 */
TestUnit.prototype.toString = function toString() {
   return this.title + ' : ' + (this.isSuccessful() ? 'success' : 'fail') + ' (' + this.countSuccessfulTests() + '/' + this.countTotalTests() + ')';
};

/**
 *
 * @param {number} id
 * @returns {TestUnit}
 */
TestUnit.get = function (id) {
   return TestUnit.ALL[id];
};

/**
 * Last ID used for for a test
 * @type {number}
 */
TestUnit.lastId = 0;

/**
 * List of all tests
 * @type {TestUnit[]}
 */
TestUnit.ALL = [];

TestUnit.TYPES = { test: 'test',
   unit: 'unit' };

/**
 *
 * @type {Object.<TestType>}
 * @namespace TestUnit
 */
TestUnit.TEST_TYPES = {};

exports.default = TestUnit;


},{"./Context":1,"./Section":6,"./TestExecution":7,"./TestType":8,"./common":10,"./functions":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Mustache = require('mustache');

/**
 *
 * @param value
 * @returns {*}
 */
function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 *
 * text from http://ksblog.org/index.php?q=lpad-rpad-functions-javascript&id=44
 */
function lpad(originalstr, length, strToPad) {
  while (originalstr.length < length) {
    originalstr = strToPad + originalstr;
  }return originalstr;
}

function render2dom(template, value) {

  var /** @type {HTMLElement} */div, /** @type {string}      */htmlString;

  htmlString = Mustache.render(template, value);

  div = document.createElement('div');
  div.innerHTML = htmlString;

  return div.firstChild;
}

/**
 *
 * @param {number} time
 * @returns {string}
 */
function time2string(time) {

  var /** @type {string} */timeString, /** @type {number} */hours, /** @type {number} */minutes, /** @type {number} */seconds, /** @type {number} */milliseconds;

  if (time === undefined) return '';

  hours = Math.floor(time / (60 * 60 * 1000));
  time -= hours * 60 * 60 * 1000;

  minutes = Math.floor(time / (60 * 1000));
  time -= minutes * 60 * 1000;

  seconds = Math.floor(time / 1000);
  time -= seconds * 1000;

  milliseconds = time;

  timeString = hours + 'h' + lpad(minutes, 2, '0') + 'm' + lpad(milliseconds, 4, '0');

  return timeString;
}

var nonStrictFunction = { Console_groupCollapsed: console.groupCollapsed,
  Console_groupEnd: console.groupEnd,
  Console_warn: console.warn,
  Console_log: console.log };

nonStrictFunction.groupCollapsed = function () {
  nonStrictFunction.Console_groupCollapsed.apply(console, arguments);
};

nonStrictFunction.groupEnd = function () {
  nonStrictFunction.Console_groupEnd.apply(console, arguments);
};

nonStrictFunction.warn = function () {
  nonStrictFunction.Console_warn.apply(console, arguments);
};

nonStrictFunction.log = function () {
  nonStrictFunction.Console_warn.apply(console, arguments);
};

exports.copy = copy;
exports.lpad = lpad;
exports.nonStrictFunction = nonStrictFunction;
exports.render2dom = render2dom;
exports.time2string = time2string;


},{"mustache":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTest_execute = exports.buildTest = undefined;

var _common = require('./common');

var common = _interopRequireWildcard(_common);

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }newObj.default = obj;return newObj;
  }
}

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


},{"./common":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
                      value: true
});
var lang = { section: { startDate: 'Start date',
                                            endDate: 'End date',
                                            duration: 'Duration',
                                            second: 'second',
                                            countTotal: 'total',
                                            countSuccess: 'success',
                                            countFail: 'fails',
                                            yes: 'yes',
                                            no: 'no' },
                      test: { startTime: 'Start time',
                                            endTime: 'End time',
                                            duration: 'Duration',
                                            second: 'second',
                                            countTotal: 'Tests',
                                            countSuccess: 'Successes',
                                            fail_plural: 'fails',
                                            fail: 'fail',
                                            yes: 'yes',
                                            no: 'no' } };

exports.default = lang;


},{}],13:[function(require,module,exports){
'use strict';

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _Project = require('./Project');

var _Project2 = _interopRequireDefault(_Project);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

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


},{"./Context":1,"./Project":5}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var token = {};

exports.token = token;


},{}],15:[function(require,module,exports){
'use strict';

module.exports = require('./dist/js/main');

},{"./dist/js/main":13}],16:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.2.1';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0XFxqc1xcQ29udGV4dC5qcyIsImRpc3RcXGpzXFxET01Qcm9qZWN0LmpzIiwiZGlzdFxcanNcXERPTVNlY3Rpb24uanMiLCJkaXN0XFxqc1xcRE9NVGVzdC5qcyIsImRpc3RcXGpzXFxQcm9qZWN0LmpzIiwiZGlzdFxcanNcXFNlY3Rpb24uanMiLCJkaXN0XFxqc1xcVGVzdEV4ZWN1dGlvbi5qcyIsImRpc3RcXGpzXFxUZXN0VHlwZS5qcyIsImRpc3RcXGpzXFxUZXN0VW5pdC5qcyIsImRpc3RcXGpzXFxjb21tb24uanMiLCJkaXN0XFxqc1xcZnVuY3Rpb25zLmpzIiwiZGlzdFxcanNcXGxhbmcuanMiLCJkaXN0XFxqc1xcbWFpbi5qcyIsImRpc3RcXGpzXFxwcml2YXRlLmpzIiwiaW5kZXguanMiLCJub2RlX21vZHVsZXMvbXVzdGFjaGUvbXVzdGFjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTs7QUFFQSxPQUFPLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFDMUMsVUFBTyxJQUFQO0NBREg7O0FBSUEsSUFBSSxXQUFXLFFBQVEsV0FBUixDQUFYOztBQUVKLElBQUksWUFBWSx1QkFBdUIsUUFBdkIsQ0FBWjs7QUFFSixJQUFJLFlBQVksUUFBUSxZQUFSLENBQVo7O0FBRUosSUFBSSxhQUFhLHVCQUF1QixTQUF2QixDQUFiOztBQUVKLElBQUksV0FBVyxRQUFRLFdBQVIsQ0FBWDs7QUFFSixTQUFTLHNCQUFULENBQWdDLEdBQWhDLEVBQXFDO0FBQUUsVUFBTyxPQUFPLElBQUksVUFBSixHQUFpQixHQUF4QixHQUE4QixFQUFFLFNBQVMsR0FBVCxFQUFoQyxDQUFUO0NBQXJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9TZWN0aW9uID0gcmVxdWlyZSgnLi9TZWN0aW9uJyk7XG5cbnZhciBfU2VjdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TZWN0aW9uKTtcblxudmFyIF9UZXN0VW5pdCA9IHJlcXVpcmUoJy4vVGVzdFVuaXQnKTtcblxudmFyIF9UZXN0VW5pdDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UZXN0VW5pdCk7XG5cbnZhciBfcHJpdmF0ZSA9IHJlcXVpcmUoJy4vcHJpdmF0ZScpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRoaXNUZXN0Q29udGV4dEluZm9cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gIGFzeW5jXG4gKiBAcHJvcGVydHkge1Rlc3RVbml0fSBwYXJlbnRcbiAqIEBwcm9wZXJ0eSB7UHJvamVjdH0gIHByb2plY3RcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gIHN0cmljdFxuICogQHByb3BlcnR5IHtUZXN0VW5pdH0gdGVzdFxuICpcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9XG4gKiBAbmFtZSBUaGlzVGVzdENvbnRleHRcbiAqIEBwcm9wZXJ0eSB7VGhpc1Rlc3RDb250ZXh0SW5mb30gaW5mb1xuICogQHByb3BlcnR5IHtUZXN0Q29udGV4dH0gICAgICAgICBjb250ZXh0XG4gKlxuICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSAgICAgICAgICAgICAgICAgICAgdGl0bGVcbiAqIEBwYXJhbSB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgW3BhcmFtMl1cbiAqIEBwYXJhbSB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgW3BhcmFtM11cbiAqIEBwYXJhbSB7bnVtYmVyfSAgICAgICAgICAgICAgICAgICAgW3BhcmFtNF1cbiAqIEBuYW1lIFRlc3RDb250ZXh0XG4gKiBAcmV0dXJucyB7UHJvbWlzZXxUZXN0Q29udGV4dHxTZWN0aW9ufVxuICogQHRoaXMgVGhpc1Rlc3RDb250ZXh0XG4gKiBAcHJvcGVydHkge1Rlc3RDb250ZXh0fSAgICAgICAgICAgIGFzeW5jXG4gKiBAcHJvcGVydHkge1Rlc3RDb250ZXh0fSAgICAgICAgICAgIGNvbnRleHRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICAgICAgICAgZGlzYWJsZWRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259ICAgICAgICAgICAgICAgZG9uZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gICAgICAgICAgICAgICByZXNldFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gICAgICAgICAgICAgICBzZXRDb250ZXh0XG4gKiBAcHJvcGVydHkge1Rlc3RDb250ZXh0fSAgICAgICAgICAgIHN0cmljdFxuICogQHByb3BlcnR5IHtUaGlzVGVzdENvbnRleHRJbmZvfSAgICBpbmZvXG4gKi9cbnZhciBUZXN0Q29udGV4dCA9IGZ1bmN0aW9uIHRlc3QodGl0bGUsIHBhcmFtMiwgcGFyYW0zLCBwYXJhbTQpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAgICovZXhlY3V0aW9uRGVsYXksIC8qKiBAdHlwZSB7U2VjdGlvbn0gICovc2VjdGlvbiwgLyoqIEB0eXBlIHtUZXN0VW5pdH0gKi90ZXN0VW5pdCwgLyoqIEB0eXBlIHtudW1iZXJ9ICAgKi90aW1lb3V0LCAvKiogQHR5cGUgeyp9ICAgICAgICAqL3ZhbHVlO1xuXG4gICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICBpZiAoIXRoaXMuaW5mby5lbmFibGVkKSByZXR1cm4gdGhpcy5jb250ZXh0O1xuXG4gICAgICBzZWN0aW9uID0gbmV3IF9TZWN0aW9uMi5kZWZhdWx0KHRoaXMuaW5mby5wcm9qZWN0LCB0aXRsZSwgZmFsc2UsIHRoaXMuaW5mby50ZXN0KTtcblxuICAgICAgdGhpcy5pbmZvLnRlc3Quc2VjdGlvbnMucHVzaChzZWN0aW9uKTtcbiAgICAgIHJldHVybiBzZWN0aW9uO1xuICAgfVxuXG4gICBpZiAodGhpcy5pbmZvLmRlbGF5KSB7XG4gICAgICBleGVjdXRpb25EZWxheSA9IHBhcmFtMjtcbiAgICAgIHZhbHVlID0gcGFyYW0zO1xuICAgICAgdGltZW91dCA9IHBhcmFtNDtcbiAgIH0gZWxzZSB7XG4gICAgICBleGVjdXRpb25EZWxheSA9IGZhbHNlO1xuICAgICAgdmFsdWUgPSBwYXJhbTI7XG4gICAgICB0aW1lb3V0ID0gcGFyYW0zO1xuICAgfVxuXG4gICBzZWN0aW9uID0gdGhpcy5pbmZvLnRlc3Quc2VjdGlvbnNbdGhpcy5pbmZvLnRlc3Quc2VjdGlvbnMubGVuZ3RoIC0gMV07XG5cbiAgIC8vbm9pbnNwZWN0aW9uIEpTVW5yZXNvbHZlZFZhcmlhYmxlXG4gICB0ZXN0VW5pdCA9IG5ldyBfVGVzdFVuaXQyLmRlZmF1bHQoeyBhc3luYzogdGhpcy5pbmZvLmFzeW5jLFxuICAgICAgY29udGV4dDogdGhpcyxcbiAgICAgIGVuYWJsZWQ6IHRoaXMuaW5mby5lbmFibGVkLFxuICAgICAgZXhlY3V0aW9uRGVsYXk6IGV4ZWN1dGlvbkRlbGF5LFxuICAgICAgc3RyaWN0OiB0aGlzLmluZm8uc3RyaWN0LFxuICAgICAgcGFyZW50OiBzZWN0aW9uLFxuICAgICAgcHJvamVjdDogdGhpcy5pbmZvLnByb2plY3QsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgdGl0bGU6IHRpdGxlIH0pO1xuXG4gICAvLyBBZGRpbmcgdGhlIHRlc3QgdG8gdGhlIGxhc3Qgc2VjdGlvblxuICAgLy9ub2luc3BlY3Rpb24gSlNVbnJlc29sdmVkVmFyaWFibGVcbiAgIHNlY3Rpb24uYWRkVGVzdCh0ZXN0VW5pdCk7XG5cbiAgIHRoaXMucmVzZXQoKTtcblxuICAgcmV0dXJuIHRlc3RVbml0LmdldFByb21pc2UoKTtcbn07XG5cbi8qKlxuICogQHRoaXMge1RoaXNUZXN0Q29udGV4dH1cbiAqIEByZXR1cm5zIHtUZXN0Q29udGV4dH1cbiAqL1xudmFyIGFzeW5jID0gZnVuY3Rpb24gYXN5bmMoKSB7XG4gICBpZiAodGhpcy5pbmZvLmVuYWJsZWQpIHRoaXMuaW5mby5hc3luYyA9IHRydWU7XG5cbiAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Rlc3RVbml0fSB0ZXN0XG4gKiBAcmV0dXJuIFRlc3RDb250ZXh0XG4gKi9cbnZhciBidWlsZCA9IGZ1bmN0aW9uIGJ1aWxkKHRlc3QpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7VGhpc1Rlc3RDb250ZXh0fSAgICAgKi90aGlzT2JqZWN0LCAvKiogQHR5cGUge2Z1bmN0aW9ufSAgICAgICAgICAgICovdGVzdENvbnRleHQ7XG5cbiAgIHRoaXNPYmplY3QgPSB7IGluZm86IHsgYXN5bmM6IGZhbHNlLFxuICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgIGRlbGF5OiBmYWxzZSxcbiAgICAgICAgIHN0cmljdDogZmFsc2UsXG4gICAgICAgICB0ZXN0OiB0ZXN0LFxuICAgICAgICAgcHJvamVjdDogdGVzdC5nZXRQcm9qZWN0KCkgfSB9O1xuXG4gICB0ZXN0Q29udGV4dCA9IFRlc3RDb250ZXh0LmJpbmQodGhpc09iamVjdCk7XG4gICB0ZXN0Q29udGV4dC5jb25zb2xlID0gY29uc29sZS5iaW5kKHRoaXNPYmplY3QpO1xuICAgdGVzdENvbnRleHQuY29tbWVudCA9IGNvbW1lbnQuYmluZCh0aGlzT2JqZWN0KTtcbiAgIHRlc3RDb250ZXh0LmRlc2NyaWJlID0gZGVzY3JpYmUuYmluZCh0aGlzT2JqZWN0KTtcbiAgIHRlc3RDb250ZXh0LmRpc2FibGUgPSBkaXNhYmxlLmJpbmQodGhpc09iamVjdCk7XG4gICB0ZXN0Q29udGV4dC5kaXNwbGF5ID0gZGlzcGxheS5iaW5kKHRoaXNPYmplY3QpO1xuICAgdGVzdENvbnRleHQuZG9uZSA9IGRvbmUuYmluZCh0aGlzT2JqZWN0KTtcbiAgIHRlc3RDb250ZXh0LmdldERhdGEgPSBnZXREYXRhLmJpbmQodGhpc09iamVjdCk7XG4gICB0ZXN0Q29udGV4dC5ub3RlID0gbm90ZS5iaW5kKHRoaXNPYmplY3QpO1xuICAgdGVzdENvbnRleHQuY29uc3RydWN0b3JzID0geyBUZXN0OiBfVGVzdFVuaXQyLmRlZmF1bHQgfTtcbiAgIHRlc3RDb250ZXh0LnJlc2V0ID0gcmVzZXQuYmluZCh0aGlzT2JqZWN0KTtcbiAgIHRlc3RDb250ZXh0LnRvZG8gPSB0b2RvLmJpbmQodGhpc09iamVjdCk7XG4gICB0ZXN0Q29udGV4dC5faW5mbyA9IGdldEluZm8uYmluZCh0aGlzT2JqZWN0KTtcblxuICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGVzdENvbnRleHQsIHsgYXN5bmM6IHsgZ2V0OiBhc3luYy5iaW5kKHRoaXNPYmplY3QpIH0sXG4gICAgICBkZWxheTogeyBnZXQ6IGRlbGF5LmJpbmQodGhpc09iamVjdCkgfSxcbiAgICAgIHBhcmVudDogeyBnZXQ6IHBhcmVudC5iaW5kKHRoaXNPYmplY3QpIH0sXG4gICAgICBwcm9qZWN0OiB7IGdldDogcHJvamVjdC5iaW5kKHRoaXNPYmplY3QpIH0sXG4gICAgICBzdHJpY3Q6IHsgZ2V0OiBzdHJpY3QuYmluZCh0aGlzT2JqZWN0KSB9IH0pO1xuXG4gICB0aGlzT2JqZWN0LmNvbnRleHQgPSB0ZXN0Q29udGV4dDtcbiAgIHRoaXNPYmplY3QucmVzZXQgPSB0ZXN0Q29udGV4dC5yZXNldDtcblxuICAgcmV0dXJuIHRlc3RDb250ZXh0O1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICogQHJldHVybnMge1RoaXNUZXN0Q29udGV4dEluZm99XG4gKi9cbnZhciBjb21tZW50ID0gZnVuY3Rpb24gY29tbWVudCh0ZXh0KSB7XG4gICB0aGlzLmluZm8udGVzdC5jb21tZW50KHRleHQpO1xuICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbn07XG5cbi8qKlxuICogQHRoaXMge1RoaXNUZXN0Q29udGV4dH1cbiAqIEByZXR1cm5zIHtUZXN0Q29udGV4dH1cbiAqL1xudmFyIGNvbnNvbGUgPSBmdW5jdGlvbiBjb25zb2xlKGZhaWxlZE9ubHkpIHtcbiAgIGlmICh0aGlzLmluZm8uZW5hYmxlZCkgdGhpcy5pbmZvLnRlc3QuY29uc29sZShmYWlsZWRPbmx5KTtcblxuICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbn07XG5cbi8qKlxuICpcbiAqIEB0aGlzIHtUaGlzVGVzdENvbnRleHR9XG4gKiBAcmV0dXJucyB7VGVzdENvbnRleHR9XG4gKi9cbnZhciBkZWxheSA9IGZ1bmN0aW9uIGRlbGF5KCkge1xuICAgaWYgKHRoaXMuaW5mby5lbmFibGVkKSB0aGlzLmluZm8uZGVsYXkgPSB0cnVlO1xuXG4gICByZXR1cm4gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKiBAdGhpcyB7VGhpc1Rlc3RDb250ZXh0fVxuICogQHJldHVybnMge1Rlc3RDb250ZXh0fVxuICovXG52YXIgZGlzYWJsZSA9IGZ1bmN0aW9uIGRpc2FibGUoKSB7XG4gICBpZiAodGhpcy5pbmZvLmVuYWJsZWQpIHRoaXMuaW5mby5lbmFibGVkID0gZmFsc2U7XG5cbiAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gKiBAcmV0dXJucyB7VGhpc1Rlc3RDb250ZXh0SW5mb31cbiAqL1xudmFyIGRlc2NyaWJlID0gZnVuY3Rpb24gZGVzY3JpYmUodGV4dCkge1xuICAgdGhpcy5pbmZvLnRlc3QuZGVzY3JpYmUodGV4dCk7XG4gICByZXR1cm4gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtzdHJpbmd8SFRNTEVsZW1lbnR9IGxvY2F0aW9uXG4gKi9cbnZhciBkaXNwbGF5ID0gZnVuY3Rpb24gZGlzcGxheShsb2NhdGlvbikge1xuICAgdGhpcy5pbmZvLnByb2plY3QuZGlzcGxheShsb2NhdGlvbik7XG59O1xuXG4vKipcbiAqIEB0aGlzIHtUaGlzVGVzdENvbnRleHR9XG4gKiBAcmV0dXJucyB7VGVzdENvbnRleHR9XG4gKi9cbnZhciBkb25lID0gZnVuY3Rpb24gZG9uZSgpIHtcblxuICAgaWYgKHRoaXMuaW5mby5lbmFibGVkKSB0aGlzLmluZm8udGVzdC5kb25lKCk7XG5cbiAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGZhaWxlZE9ubHlcbiAqIEB0aGlzIHtUaGlzVGVzdENvbnRleHR9XG4gKi9cbnZhciBnZXREYXRhID0gZnVuY3Rpb24gZ2V0RGF0YShmYWlsZWRPbmx5KSB7XG5cbiAgIHZhciAvKiogQHR5cGUge09iamVjdH0gICovZGF0YTtcblxuICAgZGF0YSA9IHRoaXMuaW5mby50ZXN0LmdldERhdGEoZmFpbGVkT25seSk7XG5cbiAgIHJldHVybiB7IGVuZFRpbWU6IHRoaXMuaW5mby50ZXN0LmdldEVuZFRpbWUoKSxcbiAgICAgIGZhaWxlZDogdGhpcy5pbmZvLnRlc3QuY291bnRGYWlsZWRUZXN0cygpLFxuICAgICAgc2VjdGlvbnM6IGRhdGEuc2VjdGlvbnMsXG4gICAgICBzdGFydFRpbWU6IHRoaXMuaW5mby50ZXN0LmdldFN0YXJ0VGltZSgpLFxuICAgICAgc3VjY2VzczogdGhpcy5pbmZvLnRlc3QuY291bnRTdWNjZXNzZnVsVGVzdHMoKSxcbiAgICAgIHRlc3RzOiB0aGlzLmluZm8udGVzdC5jb3VudFRvdGFsVGVzdHMoKSB9O1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHJlY2VpdmVkVG9rZW5cbiAqIEB0aGlzIHtUaGlzVGVzdENvbnRleHR9XG4gKiBAcmV0dXJucyB7VGhpc1Rlc3RDb250ZXh0SW5mb31cbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgZ2V0SW5mbyA9IGZ1bmN0aW9uIGdldEluZm8ocmVjZWl2ZWRUb2tlbikge1xuXG4gICBpZiAocmVjZWl2ZWRUb2tlbiAhPT0gX3ByaXZhdGUudG9rZW4pIHRocm93ICdJbnZhbGlkIHRva2VuJztcblxuICAgcmV0dXJuIHRoaXMuaW5mbztcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBub3RlXG4gKiBAcmV0dXJucyB7VGhpc1Rlc3RDb250ZXh0SW5mb31cbiAqL1xudmFyIG5vdGUgPSBmdW5jdGlvbiBub3RlKG5vdGUpIHtcbiAgIHRoaXMuaW5mby50ZXN0Lm5vdGUobm90ZSk7XG4gICByZXR1cm4gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKlxuICogQHRoaXMge1RoaXNUZXN0Q29udGV4dH1cbiAqIEByZXR1cm5zIHtUZXN0VW5pdH1cbiAqL1xudmFyIHBhcmVudCA9IGZ1bmN0aW9uIHBhcmVudCgpIHtcbiAgIHJldHVybiB0aGlzLmluZm8udGVzdDtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtQcm9qZWN0fVxuICogQHRoaXMge1RoaXNUZXN0Q29udGV4dH1cbiAqL1xudmFyIHByb2plY3QgPSBmdW5jdGlvbiBwcm9qZWN0KCkge1xuICAgcmV0dXJuIHRoaXMuaW5mby50ZXN0LnByb2plY3Q7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlY2VpdmVkVG9rZW5dXG4gKiBAcGFyYW0ge09iamVjdH0gW2luZm9dXG4gKiBAY29uc3RydWN0b3JcbiAqIEB0aGlzIHtUaGlzVGVzdENvbnRleHR9XG4gKiBAcmV0dXJucyB7VGVzdENvbnRleHR9XG4gKi9cbnZhciByZXNldCA9IGZ1bmN0aW9uIHJlc2V0KHJlY2VpdmVkVG9rZW4sIGluZm8pIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7T2JqZWN0fSAqL29sZEluZm87XG5cbiAgIGlmIChyZWNlaXZlZFRva2VuID09PSBfcHJpdmF0ZS50b2tlbikge1xuICAgICAgb2xkSW5mbyA9IHRoaXMuaW5mbztcbiAgICAgIHRoaXMuaW5mbyA9IGluZm87XG4gICAgICAvL25vaW5zcGVjdGlvbiBKU1ZhbGlkYXRlVHlwZXNcbiAgICAgIHJldHVybiBvbGRJbmZvO1xuICAgfVxuXG4gICBpZiAoIXRoaXMuaW5mby5lbmFibGVkKSByZXR1cm4gdGhpcy5jb250ZXh0O1xuXG4gICB0aGlzLmluZm8uYXN5bmMgPSBmYWxzZTtcbiAgIHRoaXMuaW5mby5zdHJpY3QgPSBmYWxzZTtcbiAgIHRoaXMuaW5mby5lbmFibGVkID0gdHJ1ZTtcbiAgIHRoaXMuaW5mby5kZWxheSA9IGZhbHNlO1xuXG4gICByZXR1cm4gdGhpcy5jb250ZXh0O1xufTtcblxuLyoqXG4gKiBAdGhpcyB7VGhpc1Rlc3RDb250ZXh0fVxuICogQHJldHVybnMge1Rlc3RDb250ZXh0fVxuICovXG52YXIgc3RyaWN0ID0gZnVuY3Rpb24gc3RyaWN0KCkge1xuICAgaWYgKHRoaXMuaW5mby5lbmFibGVkKSB0aGlzLmluZm8uc3RyaWN0ID0gdHJ1ZTtcblxuICAgcmV0dXJuIHRoaXMuY29udGV4dDtcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHRcbiAqIEByZXR1cm5zIHtUaGlzVGVzdENvbnRleHRJbmZvfVxuICovXG52YXIgdG9kbyA9IGZ1bmN0aW9uIGNvbW1lbnQodGV4dCkge1xuICAgdGhpcy5pbmZvLnRlc3QudG9kbyh0ZXh0KTtcbiAgIHJldHVybiB0aGlzLmNvbnRleHQ7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBidWlsZDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbnRleHQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0RPTVRlc3QgPSByZXF1aXJlKCcuL0RPTVRlc3QnKTtcblxudmFyIF9ET01UZXN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RPTVRlc3QpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Byb2plY3R9IHByb2plY3RcbiAqIEBjb25zdHJ1Y3RvclxuICogQGNsYXNzIERPTVByb2plY3RcbiAqIEBleHRlbmRzIERPTVRlc3RcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gY29sbGFwc2VkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIHRpdGxlXG4gKi9cbnZhciBET01Qcm9qZWN0ID0gZnVuY3Rpb24gRE9NUHJvamVjdChwcm9qZWN0KSB7XG4gICBfRE9NVGVzdDIuZGVmYXVsdC5jYWxsKHRoaXMsIHByb2plY3QpO1xuICAgdGhpcy5wcm9qZWN0ID0gcHJvamVjdDtcbiAgIHRoaXMuY29sbGFwc2VkID0gZmFsc2U7XG59O1xuXG5ET01Qcm9qZWN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoX0RPTVRlc3QyLmRlZmF1bHQucHJvdG90eXBlKTtcbi8vbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuRE9NUHJvamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01Qcm9qZWN0O1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBET00gb2YgdGhlIHByb2plY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNvbGxhcHNlZCBJZiB0cnVlLCB0aGVuIGFsbCB0ZXN0cyB3aWxsIGJlIGNvbGxhcHNlZC5cbiAqL1xuRE9NUHJvamVjdC5wcm90b3R5cGUuYnVpbGRET00gPSBmdW5jdGlvbiBidWlsZERPTShjb2xsYXBzZWQpIHtcblxuICAgdGhpcy5nbG9iYWxET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgIHRoaXMuZ2xvYmFsRE9NLmNsYXNzTGlzdC5hZGQoJ3Rlc3RKUycpO1xuXG4gICBfRE9NVGVzdDIuZGVmYXVsdC5wcm90b3R5cGUuYnVpbGRET00uY2FsbCh0aGlzLCBjb2xsYXBzZWQpO1xuXG4gICB0aGlzLmRvbS5jbGFzc0xpc3QucmVtb3ZlKCd0ZXN0Jyk7XG4gICB0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0Jyk7XG5cbiAgIHRoaXMuZ2xvYmFsRE9NLmFwcGVuZENoaWxkKHRoaXMuZG9tKTtcblxuICAgLy8gQWRkIGF1dGhvcnNcbn07XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd8SFRNTEVsZW1lbnR9IGxvY2F0aW9uXG4gKi9cbkRPTVByb2plY3QucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiBkaXNwbGF5KGxvY2F0aW9uKSB7XG4gICB2YXIgLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi9kb207XG5cbiAgIGRvbSA9IGxvY2F0aW9uIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBsb2NhdGlvbiA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IobG9jYXRpb24pO1xuICAgdGhpcy5idWlsZERPTShmYWxzZSk7XG5cbiAgIGRvbS5hcHBlbmRDaGlsZCh0aGlzLmdsb2JhbERPTSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fVxuICovXG5ET01Qcm9qZWN0LnByb3RvdHlwZS5nZXRUZW1wbGF0ZURhdGEgPSBmdW5jdGlvbiBnZXRUZW1wbGF0ZURhdGEoKSB7XG5cbiAgIHZhciAvKiogQHR5cGUge09iamVjdH0gKi9kYXRhO1xuXG4gICBkYXRhID0gX0RPTVRlc3QyLmRlZmF1bHQucHJvdG90eXBlLmdldFRlbXBsYXRlRGF0YS5jYWxsKHRoaXMpO1xuICAgZGF0YVsnYXV0aG9ycyddID0gdGhpcy5wcm9qZWN0LmdldEF1dGhvcnMoKTtcblxuICAgcmV0dXJuIGRhdGE7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBET01Qcm9qZWN0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RE9NUHJvamVjdC5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfRE9NVGVzdCA9IHJlcXVpcmUoJy4vRE9NVGVzdCcpO1xuXG52YXIgX0RPTVRlc3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRE9NVGVzdCk7XG5cbnZhciBfbGFuZyA9IHJlcXVpcmUoJy4vbGFuZycpO1xuXG52YXIgX2xhbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGFuZyk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7U2VjdGlvbn0gc2VjdGlvblxuICogQGNvbnN0cnVjdG9yXG4gKiBAY2xhc3MgRE9NU2VjdGlvblxuICogQGV4dGVuZHMge0RPTVRlc3R9XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICBjb2xsYXBzZWRcbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGRvbVxuICogQHByb3BlcnR5IHtTZWN0aW9ufSAgICAgdGVzdFxuICovXG52YXIgRE9NU2VjdGlvbiA9IGZ1bmN0aW9uIERPTVNlY3Rpb24oc2VjdGlvbikge1xuICAgX0RPTVRlc3QyLmRlZmF1bHQuY2FsbCh0aGlzLCBzZWN0aW9uKTtcbiAgIHRoaXMuc2VjdGlvbiA9IHNlY3Rpb247XG59O1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBET00gb2YgdGhlIHNlY3Rpb25cbiAqL1xuRE9NU2VjdGlvbi5wcm90b3R5cGUuYnVpbGRET00gPSBmdW5jdGlvbiBidWlsZERPTShjb2xsYXBzZWQpIHtcbiAgIF9ET01UZXN0Mi5kZWZhdWx0LnByb3RvdHlwZS5idWlsZERPTS5jYWxsKHRoaXMsIGNvbGxhcHNlZCk7XG59O1xuXG4vKipcbiAqXG4gKi9cbkRPTVNlY3Rpb24ucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgX0RPTVRlc3QyLmRlZmF1bHQucHJvdG90eXBlLmRlc3Ryb3kuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5cbi8qKlxuICogQHJldHVybnMge0FycmF5LjxET01TZWN0aW9ufERPTVRlc3Q+fVxuICovXG5ET01TZWN0aW9uLnByb3RvdHlwZS5nZXRDaGlsZFRlc3RzID0gZnVuY3Rpb24gZ2V0VGVzdHMoKSB7XG4gICB2YXIgLyoqIEB0eXBlIHtBcnJheS48RE9NU2VjdGlvbnxET01UZXN0Pn0gKi9kb21UZXN0cywgLyoqIEB0eXBlIHtudW1iZXJ9ICAgICAgICAgICAgICAgICAgICAgKi90LCAvKiogQHR5cGUge0FycmF5LjxUZXN0VW5pdHxTZWN0aW9uPn0gICAqL3Rlc3RzO1xuXG4gICB0ZXN0cyA9IHRoaXMudGVzdC5nZXRUZXN0cygpO1xuXG4gICBkb21UZXN0cyA9IFtdO1xuXG4gICBmb3IgKHQgaW4gdGVzdHMpIHtcblxuICAgICAgaWYgKHRlc3RzW3RdLmdldERPTSgpICE9PSB1bmRlZmluZWQpIGRvbVRlc3RzLnB1c2godGVzdHNbdF0uZ2V0RE9NKCkpO2Vsc2UgZG9tVGVzdHMucHVzaChuZXcgX0RPTVRlc3QyLmRlZmF1bHQodGVzdHNbdF0pKTtcbiAgIH1cblxuICAgcmV0dXJuIGRvbVRlc3RzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIERPTSBvZiB0aGUgdGVtcGxhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbGxhcHNlZD1mYWxzZV1cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAqL1xuRE9NU2VjdGlvbi5wcm90b3R5cGUuZ2V0RE9NID0gZnVuY3Rpb24gZ2V0RE9NKGNvbGxhcHNlZCkge1xuICAgY29sbGFwc2VkID0gY29sbGFwc2VkID09PSB1bmRlZmluZWQgPyB0aGlzLmNvbGxhcHNlZCA6ICEhY29sbGFwc2VkO1xuXG4gICBpZiAodGhpcy5kb20gPT09IHVuZGVmaW5lZCB8fCBjb2xsYXBzZWQgIT09IHRoaXMuY29sbGFwc2VkKSB0aGlzLmJ1aWxkRE9NKGNvbGxhcHNlZCk7XG5cbiAgIHJldHVybiB0aGlzLmRvbTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbkRPTVNlY3Rpb24ucHJvdG90eXBlLmdldFRlbXBsYXRlRGF0YSA9IGZ1bmN0aW9uICgpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL2R1cmF0aW9uLCAvKiogQHR5cGUge251bWJlcn0gKi9lbmRUaW1lLCAvKiogQHR5cGUge251bWJlcn0gKi9zdGFydFRpbWU7XG5cbiAgIHN0YXJ0VGltZSA9IHRoaXMuc2VjdGlvbi5nZXRTdGFydFRpbWUoKTtcbiAgIGVuZFRpbWUgPSB0aGlzLnNlY3Rpb24uZ2V0RW5kVGltZSgpO1xuXG4gICBpZiAoZW5kVGltZSAhPT0gdW5kZWZpbmVkKSBkdXJhdGlvbiA9IGVuZFRpbWUgLSBzdGFydFRpbWU7XG5cbiAgIHJldHVybiB7IGNvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWQsXG4gICAgICB0b3RhbEZhaWxzOiB0aGlzLnNlY3Rpb24uY291bnRGYWlsZWRUZXN0cygpLFxuICAgICAgdG90YWxTdWNjZXNzZXM6IHRoaXMuc2VjdGlvbi5jb3VudFN1Y2Nlc3NmdWxUZXN0cygpLFxuICAgICAgdG90YWxUZXN0czogdGhpcy5zZWN0aW9uLmNvdW50VG90YWxUZXN0cygpLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuc2VjdGlvbi5nZXREZXNjcmlwdGlvbigpLFxuICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgZW5kVGltZTogY29tbW9uLnRpbWUyc3RyaW5nKGVuZFRpbWUpLFxuICAgICAgbGFuZzogX2xhbmcyLmRlZmF1bHQuc2VjdGlvbixcbiAgICAgIHN0YXJ0VGltZTogY29tbW9uLnRpbWUyc3RyaW5nKHN0YXJ0VGltZSksXG4gICAgICBzdWNjZXNzOiB0aGlzLnNlY3Rpb24uaXNTdWNjZXNzZnVsKCksXG4gICAgICB0aXRsZTogdGhpcy5zZWN0aW9uLmdldFRpdGxlKCkgfTtcbn07XG5cbi8qKlxuICpcbiAqIExhbmcgdmFsdWVzIDpcbiAqICAgIC0gc3RhcnREYXRlXG4gKiAgICAtIGVuZERhdGVcbiAqICAgIC0gZHVyYXRpb25cbiAqICAgIC0gc2Vjb25kXG4gKiAgICAtIGNvdW50VG90YWxcbiAqICAgIC0gY291bnRTdWNjZXNzXG4gKiAgICAtIGNvdW50RmFpbFxuICogICAgLSB5ZXNcbiAqICAgIC0gbm9cbiAqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTZWN0aW9uVGVtcGxhdGVEYXRhXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIGRlc2NyaXB0aW9uICAtIERlc2NyaXB0aW9uIG9mIHRoZSBzZWN0aW9uXG4gKiBAcHJvcGVydHkge251bWJlcn0gIGNvdW50VG90YWwgICAtIFRvdGFsIG51bWJlciBvZiB0ZXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9ICBjb3VudFN1Y2Nlc3MgLSBUb3RhbCBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCB0ZXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9ICBjb3VudEZhaWwgICAgLSBUb3RhbCBudW1iZXIgb2YgZmFpbGVkIHRlc3RzXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIGR1cmF0aW9uICAgICAtIER1cmF0aW9uIChpbiBzZWNvbmQpIG9mIHRoZSB0b3RhbCBleGVjdXRpb24gdGltZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICBlbmREYXRlICAgICAgLSBFbmQgZGF0ZSBvZiB0aGUgbGF0ZXN0IHRlc3Qgb2YgdGhlIHNlY3Rpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgc3RhcnREYXRlICAgIC0gRGF0ZSBvZiB0aGUgZmlyc3QgdGVzdFxuICogQHByb3BlcnR5IHtib29sZWFufSBzdWNjZXNzICAgICAgLSBJZiB0cnVlLCB0aGVuIGFsbCB0aGUgdGVzdCBvZiB0aGUgc2VjdGlvbiB3YXMgc3VjY2Vzc2Z1bC4gRmFsc2Ugb3RoZXJ3aXNlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gIHRpdGxlICAgICAgICAtIFRpdGxlIG9mIHRoZSBzZWN0aW9uXG4gKi9cblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuRE9NU2VjdGlvbi5wcm90b3R5cGUuZ2V0VGVtcGxhdGUgPSBmdW5jdGlvbiBnZXRUZW1wbGF0ZSgpIHtcbiAgIHJldHVybiAnPGRpdiBjbGFzcz1cInRlc3QgZ3JvdXAge3sjc3VjY2Vzc319cGFzc3t7L3N1Y2Nlc3N9fXt7XnN1Y2Nlc3N9fWZhaWx7ey9zdWNjZXNzfX0ge3sjY29sbGFwc2VkfX1jb2xsYXBzZWR7ey9jb2xsYXBzZWR9fSB7eyNzZXZlcmFsRmFpbHN9fXNldmVyYWxGYWlsc3t7L3NldmVyYWxGYWlsc319XCI+JyArICc8aGVhZGVyPicgKyAnPGRpdiBpZD1cInRpdGxlXCI+e3t0aXRsZX19PC9kaXY+JyArICc8ZGl2IGlkPVwiZGVzY3JpcHRpb25cIj57e2Rlc2NyaXB0aW9ufX08L2Rpdj4nICsgJzxkaXYgaWQ9XCJmYWlsc1wiPnt7dG90YWxGYWlsc319PC9kaXY+JyArICc8ZGl2IGlkPVwic3VjY2Vzc2VzXCI+e3t0b3RhbFN1Y2Nlc3Nlc319PC9kaXY+JyArICc8ZGl2IGlkPVwiY291bnRUZXN0c1wiPnt7dG90YWxUZXN0c319PC9kaXY+JyArICc8ZGl2IGlkPVwic3VjY2Vzc2VzQnlUZXN0c1wiPnt7dG90YWxTdWNjZXNzZXN9fS97e3RvdGFsVGVzdHN9fTwvZGl2PicgKyAne3sjdG9Eb0xpc3R9fTxkaXYgY2xhc3M9XCJ0b2RvXCI+e3sufX08L2Rpdj57ey90b0RvTGlzdH19JyArICd7eyNjb21tZW50c319PGRpdiBjbGFzcz1cImNvbW1lbnRcIj57ey59fTwvZGl2Pnt7L2NvbW1lbnRzfX0nICsgJzwvaGVhZGVyPicgKyAnPGRpdiBpZD1cInRlc3RzXCI+PC9kaXY+JyArICc8ZGl2IGlkPVwibmV4dHNcIj48L2Rpdj4nICsgJzwvZGl2Pic7XG59O1xuXG5leHBvcnRzLmRlZmF1bHQgPSBET01TZWN0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9RE9NU2VjdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfRE9NU2VjdGlvbiA9IHJlcXVpcmUoJy4vRE9NU2VjdGlvbicpO1xuXG52YXIgX0RPTVNlY3Rpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfRE9NU2VjdGlvbik7XG5cbnZhciBfbGFuZyA9IHJlcXVpcmUoJy4vbGFuZycpO1xuXG52YXIgX2xhbmcyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfbGFuZyk7XG5cbnZhciBfU2VjdGlvbiA9IHJlcXVpcmUoJy4vU2VjdGlvbicpO1xuXG52YXIgX1NlY3Rpb24yID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfU2VjdGlvbik7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxudmFyIGNvbW1vbiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb21tb24pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Rlc3RVbml0fSB0ZXN0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBjbGFzcyBET01UZXN0XG4gKiBAcHJvcGVydHkge1Rlc3RVbml0fSAgICAgICAgICAgICAgICAgICB0ZXN0XG4gKiBAcHJvcGVydHkge0FycmF5LjxET01UZXN0fERPTVNlY3Rpb24+fSBjaGlsZFRlc3RzXG4gKiBAcHJvcGVydHkge0RPTVRlc3RbXX0gICAgICAgICAgICAgICAgICBwcm9taXNlVGVzdHNcbiAqL1xudmFyIERPTVRlc3QgPSBmdW5jdGlvbiBET01UZXN0KHRlc3QpIHtcbiAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICB0aGlzLnRlc3Quc2V0RE9NKHRoaXMpO1xuICAgdGhpcy5jaGlsZFRlc3RzID0gW107XG4gICB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG59O1xuXG4vKipcbiAqIEJ1aWxkIHRoZSBkb20gb2YgdGhlIHRlc3RcbiAqL1xuRE9NVGVzdC5wcm90b3R5cGUuYnVpbGRET00gPSBmdW5jdGlvbiBidWlsZERPTShjb2xsYXBzZWQpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAgICAgICovYywgLyoqIEB0eXBlIHtPYmplY3R9ICAgICAgKi9kYXRhLCAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL2RvbVRlc3RzLCAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL2RvbUhlYWRlciwgLyoqIEB0eXBlIHtudW1iZXJ9ICAgICAgKi90O1xuXG4gICB0aGlzLmNvbGxhcHNlZCA9IGNvbGxhcHNlZDtcbiAgIGRhdGEgPSB0aGlzLmdldFRlbXBsYXRlRGF0YSgpO1xuXG4gICB0aGlzLmRvbSA9IGNvbW1vbi5yZW5kZXIyZG9tKHRoaXMuZ2V0VGVtcGxhdGUoKSwgZGF0YSk7XG5cbiAgIGRvbUhlYWRlciA9IHRoaXMuZG9tLnF1ZXJ5U2VsZWN0b3IoJ2hlYWRlcicpO1xuXG4gICBkb21IZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuICAgICAgdmFyIC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovb2xkRE9NO1xuXG4gICAgICBpZiAodGhpcy5jb2xsYXBzZWQpIHRoaXMuZG9tLmNsYXNzTGlzdC5yZW1vdmUoJ2NvbGxhcHNlZCcpO2Vsc2UgdGhpcy5kb20uY2xhc3NMaXN0LmFkZCgnY29sbGFwc2VkJyk7XG5cbiAgICAgIG9sZERPTSA9IHRoaXMuZG9tO1xuXG4gICAgICB0aGlzLmJ1aWxkRE9NKCF0aGlzLmNvbGxhcHNlZCk7XG5cbiAgICAgIG9sZERPTS5wYXJlbnRFbGVtZW50LnJlcGxhY2VDaGlsZCh0aGlzLmRvbSwgb2xkRE9NKTtcblxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICB9LmJpbmQodGhpcykpO1xuXG4gICBpZiAodGhpcy5jb2xsYXBzZWQpIHtcbiAgICAgIGZvciAoYyBpbiB0aGlzLmNoaWxkVGVzdHMpIHtcbiAgICAgICAgIHRoaXMuY2hpbGRUZXN0c1tjXS5kZXN0cm95KCk7XG4gICAgICB9XG4gICB9IGVsc2Uge1xuICAgICAgLy8gVGVzdHNcbiAgICAgIGRvbVRlc3RzID0gdGhpcy5kb20ucXVlcnlTZWxlY3RvcignZGl2I3Rlc3RzJyk7XG5cbiAgICAgIHRoaXMuY2hpbGRUZXN0cyA9IHRoaXMuZ2V0Q2hpbGRUZXN0cygpO1xuXG4gICAgICBmb3IgKHQgaW4gdGhpcy5jaGlsZFRlc3RzKSB7XG4gICAgICAgICBkb21UZXN0cy5hcHBlbmRDaGlsZCh0aGlzLmNoaWxkVGVzdHNbdF0uZ2V0RE9NKCkpO1xuICAgICAgfVxuXG4gICAgICAvLyBQcm9taXNlcyB0ZXN0c1xuICAgICAgZG9tVGVzdHMgPSB0aGlzLmRvbS5xdWVyeVNlbGVjdG9yKCdkaXYjdGhlblRlc3RzJyk7XG5cbiAgICAgIHRoaXMudGhlblRlc3RzID0gdGhpcy5nZXRUaGVuVGVzdHMoKTtcblxuICAgICAgZm9yICh0IGluIHRoaXMudGhlblRlc3RzKSB7XG4gICAgICAgICBkb21UZXN0cy5hcHBlbmRDaGlsZCh0aGlzLnRoZW5UZXN0c1t0XS5nZXRET00oKSk7XG4gICAgICB9XG4gICB9XG59O1xuXG4vKipcbiAqIERlc3Ryb3kgdGhlIERPTSBUZXN0LlxuICogQmFzaWNhbGx5LCB0aGlzIG1lYW5zIHRoYXQgYWxsIHJlZmVyZW5jZXMgb2YgdGhlIG9iamVjdCBzaG91bGQgYmUgZGVsZXRlZCBhbmQgdGhlIGRvbSB0b28uXG4gKiBUaGUgc2FtZSBzaG91bGQgYmUgZG9uZSBmb3IgaGlzIGNoaWxkcmVuc1xuICovXG5ET01UZXN0LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL2M7XG5cbiAgIHRoaXMudGVzdC5zZXRET00odW5kZWZpbmVkKTtcblxuICAgaWYgKHRoaXMuZG9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLmRvbS5wYXJlbnRFbGVtZW50ICE9PSBudWxsICYmIHRoaXMuZG9tLnBhcmVudEVsZW1lbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhpcy5kb20ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmRvbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZG9tID0gdW5kZWZpbmVkO1xuICAgfVxuXG4gICBmb3IgKGMgaW4gdGhpcy5jaGlsZFRlc3RzKSB7XG4gICAgICB0aGlzLmNoaWxkVGVzdHNbY10uZGVzdHJveSgpO1xuICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIERPTSBvZiB0aGUgdGVtcGxhdGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2NvbGxhcHNlZD1mYWxzZV1cbiAqIEByZXR1cm5zIHtIVE1MRWxlbWVudH1cbiAqL1xuRE9NVGVzdC5wcm90b3R5cGUuZ2V0RE9NID0gZnVuY3Rpb24gZ2V0RE9NKGNvbGxhcHNlZCkge1xuICAgY29sbGFwc2VkID0gY29sbGFwc2VkID09PSB1bmRlZmluZWQgPyB0aGlzLmNvbGxhcHNlZCA6ICEhY29sbGFwc2VkO1xuXG4gICBpZiAodGhpcy5kb20gPT09IHVuZGVmaW5lZCB8fCBjb2xsYXBzZWQgIT09IHRoaXMuY29sbGFwc2VkKSB0aGlzLmJ1aWxkRE9NKGNvbGxhcHNlZCk7XG5cbiAgIHJldHVybiB0aGlzLmRvbTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBkYXRhIGV4cGVjdGVkIGZvciB0aGUgdGVtcGxhdGVcbiAqIEByZXR1cm5zIHtUZXN0VGVtcGxhdGVEYXRhfVxuICovXG5ET01UZXN0LnByb3RvdHlwZS5nZXRUZW1wbGF0ZURhdGEgPSBmdW5jdGlvbiBnZXRUZW1wbGF0ZURhdGEoKSB7XG5cbiAgIHZhciAvKiogQHR5cGUge251bWJlcn0gKi9kdXJhdGlvbiwgLyoqIEB0eXBlIHtudW1iZXJ9ICovZW5kVGltZSwgLyoqIEB0eXBlIHtudW1iZXJ9ICovZmFpbHMsIC8qKiBAdHlwZSB7bnVtYmVyfSAqL3N0YXJ0VGltZTtcblxuICAgc3RhcnRUaW1lID0gdGhpcy50ZXN0LmdldFN0YXJ0VGltZSgpO1xuICAgZW5kVGltZSA9IHRoaXMudGVzdC5nZXRFbmRUaW1lKCk7XG5cbiAgIGlmIChlbmRUaW1lICE9PSB1bmRlZmluZWQpIGR1cmF0aW9uID0gKGVuZFRpbWUgLSBzdGFydFRpbWUpIC8gMTAwMDtcblxuICAgZmFpbHMgPSB0aGlzLnRlc3QuY291bnRGYWlsZWRUZXN0cygpO1xuXG4gICByZXR1cm4geyBhc3luYzogdGhpcy50ZXN0LmFzeW5jLFxuICAgICAgY29sbGFwc2VkOiB0aGlzLmNvbGxhcHNlZCxcbiAgICAgIGNvbW1lbnRzOiB0aGlzLnRlc3QuZ2V0Q29tbWVudHMoKSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLnRlc3QuZ2V0RGVzY3JpcHRpb24oKSxcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgIGVuZFRpbWU6IGNvbW1vbi50aW1lMnN0cmluZyhlbmRUaW1lKSxcbiAgICAgIGVycm9yczogdGhpcy50ZXN0LmVycm9ycy5zbGljZSgwKSxcbiAgICAgIGlzR3JvdXA6IHRoaXMudGVzdC5pc0dyb3VwKCksXG4gICAgICBsYW5nOiBfbGFuZzIuZGVmYXVsdC50ZXN0LFxuICAgICAgbm90ZXM6IHRoaXMudGVzdC5nZXROb3RlcygpLFxuICAgICAgcmVzdWx0OiB0aGlzLnRlc3QuZ2V0UmVzdWx0KCksXG4gICAgICBzZXZlcmFsRmFpbHM6IGZhaWxzID4gMSxcbiAgICAgIHN0YXJ0VGltZTogY29tbW9uLnRpbWUyc3RyaW5nKHN0YXJ0VGltZSksXG4gICAgICBzdHJpY3Q6IHRoaXMudGVzdC5zdHJpY3RNb2RlLFxuICAgICAgc3VjY2VzczogdGhpcy50ZXN0LmlzU3VjY2Vzc2Z1bCgpLFxuICAgICAgdGhlbnM6IHRoaXMudGVzdC5nZXROZXh0cygpLFxuICAgICAgdGl0bGU6IHRoaXMudGVzdC5nZXRUaXRsZSgpLFxuICAgICAgdG9Eb0xpc3Q6IHRoaXMudGVzdC5nZXRUb0RvTGlzdCgpLFxuICAgICAgdG90YWxGYWlsczogZmFpbHMsXG4gICAgICB0b3RhbFN1Y2Nlc3NlczogdGhpcy50ZXN0LmNvdW50U3VjY2Vzc2Z1bFRlc3RzKCksXG4gICAgICB0b3RhbFRlc3RzOiB0aGlzLnRlc3QuY291bnRUb3RhbFRlc3RzKCkgfTtcbn07XG5cbi8vbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKlxuICogQHJldHVybnMge1Rlc3RVbml0fVxuICovXG5ET01UZXN0LnByb3RvdHlwZS5nZXRUZXN0ID0gZnVuY3Rpb24gZ2V0VGVzdCgpIHtcbiAgIHJldHVybiB0aGlzLnRlc3Q7XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtBcnJheS48RE9NU2VjdGlvbnxET01UZXN0Pn1cbiAqL1xuRE9NVGVzdC5wcm90b3R5cGUuZ2V0Q2hpbGRUZXN0cyA9IGZ1bmN0aW9uIGdldFRlc3RzKCkge1xuICAgdmFyIC8qKiBAdHlwZSB7QXJyYXkuPERPTVNlY3Rpb258RE9NVGVzdD59ICovZG9tVGVzdHMsIC8qKiBAdHlwZSB7U2VjdGlvbltdfSAgICAgICAgICAgICAgICAgICovc2VjdGlvbnMsIC8qKiBAdHlwZSB7bnVtYmVyfSAgICAgICAgICAgICAgICAgICAgICovdCwgLyoqIEB0eXBlIHtBcnJheS48VGVzdFVuaXR8U2VjdGlvbj59ICAgKi90ZXN0cztcblxuICAgaWYgKHRoaXMudGVzdC5zZWN0aW9uc1swXS5pc0RlZmF1bHQoKSkge1xuICAgICAgdGVzdHMgPSB0aGlzLnRlc3Quc2VjdGlvbnNbMF0uZ2V0VGVzdHMoKTtcbiAgICAgIHNlY3Rpb25zID0gdGhpcy50ZXN0LmdldFNlY3Rpb25zKCk7XG4gICAgICBzZWN0aW9ucy5zaGlmdCgpO1xuICAgfSBlbHNlIHtcbiAgICAgIHRlc3RzID0gdGhpcy50ZXN0LmdldFNlY3Rpb25zKCk7XG4gICB9XG5cbiAgIGRvbVRlc3RzID0gW107XG4gICB0ZXN0cyA9IHRlc3RzLmNvbmNhdChzZWN0aW9ucyk7XG5cbiAgIGZvciAodCBpbiB0ZXN0cykge1xuXG4gICAgICBpZiAodGVzdHNbdF0uZ2V0RE9NKCkgIT09IHVuZGVmaW5lZCkgZG9tVGVzdHMucHVzaCh0ZXN0c1t0XS5nZXRET00oKSk7ZWxzZSBpZiAodGVzdHNbdF0gaW5zdGFuY2VvZiBfU2VjdGlvbjIuZGVmYXVsdCkgZG9tVGVzdHMucHVzaChuZXcgX0RPTVNlY3Rpb24yLmRlZmF1bHQodGVzdHNbdF0pKTtlbHNlIGRvbVRlc3RzLnB1c2gobmV3IERPTVRlc3QodGVzdHNbdF0pKTtcbiAgIH1cblxuICAgcmV0dXJuIGRvbVRlc3RzO1xufTtcblxuLyoqXG4gKlxuICovXG5ET01UZXN0LnByb3RvdHlwZS5nZXRUaGVuVGVzdHMgPSBmdW5jdGlvbiBnZXRUaGVuVGVzdHMoKSB7XG4gICB2YXIgLyoqIEB0eXBlIHtET01UZXN0W119ICAqL2RvbVRlc3RzLCAvKiogQHR5cGUge251bWJlcn0gICAgICovdCwgLyoqIEB0eXBlIHtUZXN0VW5pdFtdfSAqL3Rlc3RzO1xuXG4gICBkb21UZXN0cyA9IFtdO1xuXG4gICB0ZXN0cyA9IHRoaXMudGVzdC5nZXROZXh0cygpO1xuXG4gICBmb3IgKHQgaW4gdGVzdHMpIHtcbiAgICAgIGRvbVRlc3RzLnB1c2gobmV3IERPTVRlc3QodGVzdHNbdF0pKTtcbiAgIH1cblxuICAgcmV0dXJuIGRvbVRlc3RzO1xufTtcblxuLyoqXG4gKlxuICogTGFuZyB2YWx1ZXMgOlxuICogICAgLSBzdGFydERhdGVcbiAqICAgIC0gZW5kRGF0ZVxuICogICAgLSBkdXJhdGlvblxuICogICAgLSBzZWNvbmRcbiAqICAgIC0gY291bnRUb3RhbFxuICogICAgLSBjb3VudFN1Y2Nlc3NcbiAqICAgIC0gY291bnRGYWlsXG4gKiAgICAtIHllc1xuICogICAgLSBub1xuICpcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRlc3RUZW1wbGF0ZURhdGFcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICBhc3luY1xuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgIGNvbGxhcHNlZCAgICAtIElmIHRydWUsIHRoZW4gYWRkIHRoZSBjbGFzcyBcImNvbGxhcHNlZFwiIHRvIHRoZSBkaXYuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgICAgZGVzY3JpcHRpb24gIC0gRGVzY3JpcHRpb24gb2YgdGhlIHNlY3Rpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICBkdXJhdGlvbiAgICAgLSBEdXJhdGlvbiAoaW4gc2Vjb25kKSBvZiB0aGUgdG90YWwgZXhlY3V0aW9uIHRpbWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICBlbmRUaW1lICAgICAgLSBFbmQgZGF0ZSBvZiB0aGUgbGF0ZXN0IHRlc3Qgb2YgdGhlIHNlY3Rpb25cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0LjxzdHJpbmc+fSBsYW5nICAgICAgICAgLSBMb2NhbCBkYXRhXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgcmVzdWx0ICAgICAgIC0gUmVzdWx0IG9mIHRoZSB1bml0IHRlc3QuIHRydWUgOiB0aGUgdW5pdCB0ZXN0IGlzIHN1Y2Nlc3NmdWwuIGZhbHNlIG90aGVyd2lzZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgIHN0YXJ0VGltZSAgICAtIERhdGUgb2YgdGhlIGZpcnN0IHRlc3RcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICBzdHJpY3QgICAgICAgLSBJbmRpY2F0ZSB3ZWl0aGVyICh0cnVlKSBvciBub3QgKGZhbHNlKSB0aGUgdGVzdCBpcyBpbiBzdHJpY3QgbW9kZVxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgIHN1Y2Nlc3MgICAgICAtIElmIHRydWUsIHRoZW4gdGhlIHRlc3QsIHRoZSBjaGlsZCB0ZXN0cyBhbmQgdGhlIHNpYmxpbmcgdGVzdHMgYXJlIHN1Y2Nlc3NmdWwuIEZhbHNlIG90aGVyd2lzZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgIHRpdGxlICAgICAgICAtIFRpdGxlIG9mIHRoZSBzZWN0aW9uXG4gKiBAcHJvcGVydHkge251bWJlcn0gICAgICAgICAgdG90YWxGYWlscyAgIC0gVG90YWwgbnVtYmVyIG9mIGZhaWxlZCB0ZXN0c1xuICogQHByb3BlcnR5IHtudW1iZXJ9ICAgICAgICAgIHRvdGFsU3VjY2VzcyAtIFRvdGFsIG51bWJlciBvZiBzdWNjZXNzZnVsIHRlc3RzXG4gKiBAcHJvcGVydHkge251bWJlcn0gICAgICAgICAgdG90YWxUZXN0cyAgIC0gVG90YWwgbnVtYmVyIG9mIHRlc3Rlc1xuICovXG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbkRPTVRlc3QucHJvdG90eXBlLmdldFRlbXBsYXRlID0gZnVuY3Rpb24gZ2V0VGVtcGxhdGUoKSB7XG5cbiAgIHJldHVybiAnPGRpdiBjbGFzcz1cInRlc3Qge3sjc3VjY2Vzc319cGFzc3t7L3N1Y2Nlc3N9fXt7XnN1Y2Nlc3N9fWZhaWx7ey9zdWNjZXNzfX0ge3sjY29sbGFwc2VkfX1jb2xsYXBzZWR7ey9jb2xsYXBzZWR9fSB7eyNpc0dyb3VwfX1ncm91cHt7L2lzR3JvdXB9fSB7eyNzZXZlcmFsRmFpbHN9fXNldmVyYWxGYWlsc3t7L3NldmVyYWxGYWlsc319XCI+JyArICc8aGVhZGVyPicgKyAnPGRpdiBpZD1cInRpdGxlXCI+e3sjdGl0bGV9fXt7dGl0bGV9fXt7L3RpdGxlfX17e150aXRsZX19PHNwYW4gc3R5bGU9XCJmb250LXN0eWxlOiBpdGFsaWNcIj5ubyB0aXRsZTwvc3Bhbj57ey90aXRsZX19PC9kaXY+JyArICc8ZGl2IGlkPVwiZGVzY3JpcHRpb25cIj57e3tkZXNjcmlwdGlvbn19fTwvZGl2PicgKyAnPGRpdiBpZD1cImZhaWxzXCI+e3t0b3RhbEZhaWxzfX08L2Rpdj4nICsgJzxkaXYgaWQ9XCJzdWNjZXNzZXNcIj57e3RvdGFsU3VjY2Vzc2VzfX08L2Rpdj4nICsgJzxkaXYgaWQ9XCJjb3VudFRlc3RzXCI+e3t0b3RhbFRlc3RzfX08L2Rpdj4nICsgJzxkaXYgaWQ9XCJzdWNjZXNzZXNCeVRlc3RzXCI+e3t0b3RhbFN1Y2Nlc3Nlc319L3t7dG90YWxUZXN0c319PC9kaXY+JyArICd7eyNlcnJvcnN9fTxkaXYgY2xhc3M9XCJlcnJvclJlYXNvblwiPnt7ey59fX08L2Rpdj57ey9lcnJvcnN9fScgKyAne3sjdG9Eb0xpc3R9fTxkaXYgY2xhc3M9XCJ0b2RvXCI+e3t7Ln19fTwvZGl2Pnt7L3RvRG9MaXN0fX0nICsgJ3t7I2NvbW1lbnRzfX08ZGl2IGNsYXNzPVwiY29tbWVudFwiPnt7ey59fX08L2Rpdj57ey9jb21tZW50c319JyArICd7eyNub3Rlc319PGRpdiBjbGFzcz1cIm5vdGVcIj57e3sufX19PC9kaXY+e3svbm90ZXN9fScgKyAnPC9oZWFkZXI+JyArICc8ZGl2IGlkPVwidGVzdHNcIj48L2Rpdj4nICsgJzxkaXYgaWQ9XCJ0aGVuVGVzdHNcIj48L2Rpdj4nICsgJzwvZGl2Pic7XG59O1xuXG4vKipcbiAqIFJlZnJlc2ggdGhlIHRlc3QuXG4gKi9cbkRPTVRlc3QucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiBidWlsZEhlYWRlcigpIHtcbiAgIHZhciAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL2RvbTtcblxuICAgaWYgKHRoaXMuZG9tID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgZG9tID0gdGhpcy5kb207XG4gICB0aGlzLmJ1aWxkRE9NKHRoaXMuY29sbGFwc2VkKTtcblxuICAgZG9tLnBhcmVudEVsZW1lbnQucmVwbGFjZUNoaWxkKHRoaXMuZG9tLCBkb20pO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gRE9NVGVzdDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPURPTVRlc3QuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgdmFsdWU6IHRydWVcbn0pO1xuXG52YXIgX0RPTVByb2plY3QgPSByZXF1aXJlKCcuL0RPTVByb2plY3QnKTtcblxudmFyIF9ET01Qcm9qZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX0RPTVByb2plY3QpO1xuXG52YXIgX1Rlc3RVbml0ID0gcmVxdWlyZSgnLi9UZXN0VW5pdCcpO1xuXG52YXIgX1Rlc3RVbml0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX1Rlc3RVbml0KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuLyoqXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKiBAY2xhc3MgUHJvamVjdFxuICogQGV4dGVuZHMgVGVzdFVuaXRcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119ICAgIGF1dGhvcnNcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgIGRlc2NyaXB0aW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICBuYW1lXG4gKi9cbnZhciBQcm9qZWN0ID0gZnVuY3Rpb24gUHJvamVjdChuYW1lKSB7XG4gICBfVGVzdFVuaXQyLmRlZmF1bHQuY2FsbCh0aGlzLCB7IHByb2plY3Q6IHRoaXMsIHRpdGxlOiBuYW1lIH0pO1xuXG4gICB0aGlzLm5hbWUgPSAhbmFtZSA/ICdUZXN0JyA6IG5hbWU7XG4gICB0aGlzLmF1dGhvcnMgPSBbXTtcbiAgIHRoaXMuZG9tUHJvamVjdCA9IG5ldyBfRE9NUHJvamVjdDIuZGVmYXVsdCh0aGlzKTtcbn07XG5cblByb2plY3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShfVGVzdFVuaXQyLmRlZmF1bHQucHJvdG90eXBlKTtcbi8vbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuUHJvamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBQcm9qZWN0O1xuXG4vL25vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBhdXRob3JcbiAqL1xuUHJvamVjdC5wcm90b3R5cGUuYWRkQXV0aG9yID0gZnVuY3Rpb24gKGF1dGhvcikge1xuICAgdGhpcy5hdXRob3JzLnB1c2goYXV0aG9yKTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfEhUTUxFbGVtZW50fSBbbG9jYXRpb249J2JvZHknXVxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cblByb2plY3QucHJvdG90eXBlLmRpc3BsYXkgPSBmdW5jdGlvbiAobG9jYXRpb24pIHtcblxuICAgbG9jYXRpb24gPSBsb2NhdGlvbiA/IGxvY2F0aW9uIDogJ2JvZHknO1xuXG4gICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmRvbVByb2plY3QuZGlzcGxheShsb2NhdGlvbik7XG4gICB9LmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ1tdfVxuICovXG5Qcm9qZWN0LnByb3RvdHlwZS5nZXRBdXRob3JzID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIHRoaXMuYXV0aG9ycy5zbGljZSgwKTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7RGF0ZX0gZGF0ZVxuICogQHJldHVybnMge251bWJlcnx1bmRlZmluZWR9XG4gKi9cblByb2plY3QucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgaWYgKGRhdGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgIHJldHVybiBkYXRlIC0gdGhpcy5nZXRTdGFydERhdGUoKTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5Qcm9qZWN0LnByb3RvdHlwZS5pc1VuaXRUZXN0ID0gZnVuY3Rpb24gKCkge1xuICAgcmV0dXJuIGZhbHNlO1xufTtcblxuUHJvamVjdC5wcm90b3R5cGUuaXNWYWxpZCA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0cnVlO1xufTtcblxuLy9ub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAqL1xuUHJvamVjdC5wcm90b3R5cGUuc2V0VGl0bGUgPSBmdW5jdGlvbiAodGl0bGUpIHtcbiAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbn07XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFByb2plY3Q7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Qcm9qZWN0LmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgIHZhbHVlOiB0cnVlXG59KTtcbi8qKlxuICpcbiAqIEB0eXBlIHtQcm9taXNlfVxuICovXG52YXIgcHJvbWlzZVJlc29sdmVkID0gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7UHJvamVjdH0gcHJvamVjdFxuICogQHBhcmFtIHtzdHJpbmd9ICBbdGl0bGVdICAgICAgICBUaXRsZSBvZiB0aGUgc2VjdGlvblxuICogQHBhcmFtIHtib29sZWFufSBkZWZhdWx0U2VjdGlvbiBJZiB0cnVlLCB0aGVuIHRoaXMgc2VjdGlvbiBpcyB0aGUgZGVmYXVsdCBzZWN0aW9uIG9mIHRoZSBwYXJlbnRcbiAqIEBwYXJhbSB7VGVzdFVuaXR9IHBhcmVudFxuICogQGNvbnN0cnVjdG9yXG4gKiBAY2xhc3MgU2VjdGlvblxuICogQGV4dGVuZCBQcm9taXNlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW58dW5kZWZpbmVkfSAgIF9pc1N1Y2Nlc3NmdWxcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbnx1bmRlZmluZWR9ICAgYXN5bmNUZXN0c1xuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgICBkZWZhdWx0U2VjdGlvblxuICogQHByb3BlcnR5IHtET01TZWN0aW9ufSAgICAgICAgICBkb21TZWN0aW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgICAgICAgIGRlc2NyaXB0aW9uXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICAgIF9oYXNGaW5pc2hlZFxuICogQHByb3BlcnR5IHtUZXN0VW5pdFtdfSAgICAgICAgICB0ZXN0c1xuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgICB0aXRsZVxuICovXG52YXIgU2VjdGlvbiA9IGZ1bmN0aW9uIFNlY3Rpb24ocHJvamVjdCwgdGl0bGUsIGRlZmF1bHRTZWN0aW9uLCBwYXJlbnQpIHtcblxuICAgdGhpcy5pZCA9IFNlY3Rpb24ubWF4SUQrKztcbiAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgIHRoaXMudGVzdHMgPSBbXTtcbiAgIHRoaXMucHJvamVjdCA9IHByb2plY3Q7XG4gICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgIHRoaXMuZGVmYXVsdFNlY3Rpb24gPSBkZWZhdWx0U2VjdGlvbjtcblxuICAgdGhpcy5yZXN1bHRzID0geyBjb3VudDogeyBlcnJvcnM6IDAsXG4gICAgICAgICBmYWlsczogMCxcbiAgICAgICAgIHN1Y2Nlc3NlczogMCxcbiAgICAgICAgIHRvdGFsOiAwIH0gfTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7VGVzdFVuaXR9IHRlc3RcbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuYWRkVGVzdCA9IGZ1bmN0aW9uIGFkZFRlc3QodGVzdCkge1xuXG4gICB2YXIgLyoqIEB0eXBlIHtUZXN0VW5pdHxTZWN0aW9ufSAqL3BhcmVudDtcblxuICAgdGhpcy50ZXN0cy5wdXNoKHRlc3QpO1xuXG4gICAvKnRoaXMudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0ZXN0O1xuICAgfSk7Ki9cblxuICAgaWYgKHRoaXMuYXN5bmNUZXN0cyA9PT0gZmFsc2UpIHtcbiAgICAgIGlmICh0ZXN0Lmhhc0FzeW5jVGVzdHMoKSkge1xuICAgICAgICAgdGhpcy5hc3luY1Rlc3RzID0gdHJ1ZTtcblxuICAgICAgICAgcGFyZW50ID0gdGhpcy5wYXJlbnQ7XG5cbiAgICAgICAgIC8vIFVwZGF0aW5nIHBhcmVudHMgOiB3ZSBhbGwgdGhlIHBhcmVudHMgd2hvIGNhbGwgdGhlXG4gICAgICAgICB3aGlsZSAocGFyZW50ICE9PSB1bmRlZmluZWQgJiYgKHBhcmVudCA/IHBhcmVudCA6IHt9KS5hc3luY1Rlc3RzICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXN5bmNUZXN0cyA9IHRydWU7XG4gICAgICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuXG4gICAvLyBVcGRhdGluZyBzZWN0aW9uIGJ5IGFkZGluZyB0ZXN0cyBjb3VudHNcbiAgIHRoaXMucmVmcmVzaCgpO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtkZWx0YUVycm9yc11cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsdGFGYWlsc11cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsdGFTdWNjZXNzZXNdXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlbHRhVG90YWxdXG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiByZWZyZXNoKGRlbHRhRXJyb3JzLCBkZWx0YUZhaWxzLCBkZWx0YVN1Y2Nlc3NlcywgZGVsdGFUb3RhbCkge1xuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL2Vycm9ycywgLyoqIEB0eXBlIHtudW1iZXJ9ICovZmFpbHMsIC8qKiBAdHlwZSB7bnVtYmVyfSAqL3N1Y2Nlc3NlcywgLyoqIEB0eXBlIHtudW1iZXJ9ICovdCwgLyoqIEB0eXBlIHtudW1iZXJ9ICovdG90YWw7XG5cbiAgIGlmIChkZWx0YVRvdGFsICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXN1bHRzLmNvdW50LmZhaWxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5lcnJvcnMgKz0gZGVsdGFFcnJvcnM7XG4gICAgICB0aGlzLnJlc3VsdHMuY291bnQuZmFpbHMgKz0gZGVsdGFGYWlscztcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5zdWNjZXNzZXMgKz0gZGVsdGFTdWNjZXNzZXM7XG4gICAgICB0aGlzLnJlc3VsdHMuY291bnQudG90YWwgKz0gZGVsdGFUb3RhbDtcbiAgIH0gZWxzZSB7XG4gICAgICBlcnJvcnMgPSB0aGlzLnJlc3VsdHMuY291bnQuZXJyb3JzO1xuICAgICAgZmFpbHMgPSB0aGlzLnJlc3VsdHMuY291bnQuZmFpbHM7XG4gICAgICBzdWNjZXNzZXMgPSB0aGlzLnJlc3VsdHMuY291bnQuc3VjY2Vzc2VzO1xuICAgICAgdG90YWwgPSB0aGlzLnJlc3VsdHMuY291bnQudG90YWw7XG5cbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5lcnJvcnMgPSAwO1xuICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LmZhaWxzID0gMDtcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5zdWNjZXNzZXMgPSAwO1xuICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LnRvdGFsID0gMDtcblxuICAgICAgZm9yICh0IGluIHRoaXMudGVzdHMpIHtcbiAgICAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5lcnJvcnMgKz0gdGhpcy50ZXN0c1t0XS5jb3VudEVycm9ycygpO1xuICAgICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LmZhaWxzICs9IHRoaXMudGVzdHNbdF0uY291bnRGYWlsZWRUZXN0cygpO1xuICAgICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LnN1Y2Nlc3NlcyArPSB0aGlzLnRlc3RzW3RdLmNvdW50U3VjY2Vzc2Z1bFRlc3RzKCk7XG4gICAgICAgICB0aGlzLnJlc3VsdHMuY291bnQudG90YWwgKz0gdGhpcy50ZXN0c1t0XS5jb3VudFRvdGFsVGVzdHMoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucmVzdWx0cy5jb3VudC50b3RhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICBkZWx0YUVycm9ycyA9IGVycm9ycyAtIHRoaXMucmVzdWx0cy5jb3VudC5lcnJvcnM7XG4gICAgICAgICBkZWx0YUZhaWxzID0gZmFpbHMgLSB0aGlzLnJlc3VsdHMuY291bnQuZmFpbHM7XG4gICAgICAgICBkZWx0YVN1Y2Nlc3NlcyA9IHN1Y2Nlc3NlcyAtIHRoaXMucmVzdWx0cy5jb3VudC5zdWNjZXNzZXM7XG4gICAgICAgICBkZWx0YVRvdGFsID0gdG90YWwgLSB0aGlzLnJlc3VsdHMuY291bnQudG90YWw7XG4gICAgICB9XG4gICB9XG5cbiAgIGlmICh0aGlzLnBhcmVudCAhPT0gdW5kZWZpbmVkKSBpZiAodGhpcy5wYXJlbnQucmVzdWx0cy5jb3VudC50b3RhbCAhPT0gdW5kZWZpbmVkKSB0aGlzLnBhcmVudC5yZWZyZXNoKGRlbHRhRXJyb3JzLCBkZWx0YUZhaWxzLCBkZWx0YVN1Y2Nlc3NlcywgZGVsdGFUb3RhbCk7XG5cbiAgIGlmICh0aGlzLmdldERPTSgpKSB0aGlzLmdldERPTSgpLnJlZnJlc2goKTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZmFpbGVkT25seVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5jb25zb2xlID0gZnVuY3Rpb24gKGZhaWxlZE9ubHkpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL3N1Y2Nlc3NlcywgLyoqIEB0eXBlIHtudW1iZXJ9ICovdCwgLyoqIEB0eXBlIHtudW1iZXJ9ICovdG90YWw7XG5cbiAgIHN1Y2Nlc3NlcyA9IHRoaXMuY291bnRTdWNjZXNzZnVsVGVzdHMoKTtcbiAgIHRvdGFsID0gdGhpcy5jb3VudFRvdGFsVGVzdHMoKTtcblxuICAgbm9uU3RyaWN0RnVuY3Rpb24uZ3JvdXBDb2xsYXBzZWQoKHRoaXMuZ2V0VGl0bGUoKSAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRUaXRsZSgpICsgJyA6ICcgOiAnJykgKyAoc3VjY2Vzc2VzID09PSB0b3RhbCA/ICdzdWNjZXNzJyA6ICdmYWlsJykgKyAnIDogJyArIHN1Y2Nlc3NlcyArICcvJyArIHRvdGFsKTtcblxuICAgZm9yICh0IGluIHRoaXMudGVzdHMpIHtcblxuICAgICAgaWYgKGZhaWxlZE9ubHkpIGlmICh0aGlzLnRlc3RzW3RdLmlzU3VjY2Vzc2Z1bCgpKSBjb250aW51ZTtcblxuICAgICAgdGhpcy50ZXN0c1t0XS5jb25zb2xlKGZhaWxlZE9ubHkpO1xuICAgfVxuXG4gICBub25TdHJpY3RGdW5jdGlvbi5ncm91cEVuZCgpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIHRvdGFsIG51bWJlciBvZiBlcnJvcnMgdGhhdCBoYXNuJ3QgYmVlbiBoYW5kbGVkXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5jb3VudEVycm9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgIHJldHVybiB0aGlzLnJlc3VsdHMuY291bnQuZXJyb3JzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIG51bWJlciBvZiBmYWlsZWQgdGVzdHMgaW5zaWRlIHRoZSBzZWN0aW9uXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5jb3VudEZhaWxlZFRlc3RzID0gZnVuY3Rpb24gY291bnRGYWlsZWRUZXN0cygpIHtcbiAgIHJldHVybiB0aGlzLnJlc3VsdHMuY291bnQuZmFpbHM7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5jb3VudFN1Y2Nlc3NmdWxUZXN0cyA9IGZ1bmN0aW9uIGNvdW50U3VjY2Vzc2Z1bFRlc3RzKCkge1xuICAgcmV0dXJuIHRoaXMucmVzdWx0cy5jb3VudC5zdWNjZXNzZXM7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5jb3VudFRvdGFsVGVzdHMgPSBmdW5jdGlvbiBjb3VudFRvdGFsVGVzdHMoKSB7XG4gICByZXR1cm4gdGhpcy5yZXN1bHRzLmNvdW50LnRvdGFsO1xufTtcblxuLy9ub2luc3BlY3Rpb24gUmVzZXJ2ZWRXb3JkQXNOYW1lXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuY2F0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gICB0aGlzLl9oYXNGaW5pc2hlZCA9IGZhbHNlO1xuICAgcmV0dXJuIFByb21pc2UucHJvdG90eXBlLmNhdGNoLmFwcGx5KHRoaXMuZ2V0UHJvbWlzZSgpLCBhcmd1bWVudHMpO1xufTtcblxuLy9ub2luc3BlY3Rpb24gSlNVbnVzZWRHbG9iYWxTeW1ib2xzXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvblxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uIGRlc2NyaWJlKGRlc2NyaXB0aW9uKSB7XG4gICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtQcm9taXNlfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRQcm9taXNlID0gZnVuY3Rpb24gZ2V0UHJvbWlzZSgpIHtcblxuICAgaWYgKHRoaXMucHJvbWlzZSA9PT0gdW5kZWZpbmVkKSB0aGlzLnByb21pc2UgPSBwcm9taXNlUmVzb2x2ZWQ7XG5cbiAgIHJldHVybiB0aGlzLnByb21pc2U7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJuIHtQcm9taXNlfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRDb21wbGV0ZWRQcm9taXNlID0gZnVuY3Rpb24gZ2V0Q29tcGxldGVkUHJvbWlzZSgpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL2ksIC8qKiBAdHlwZSB7UHJvbWlzZVtdfSAqL3Byb21pc2VzO1xuXG4gICBwcm9taXNlcyA9IFtdO1xuICAgZm9yIChpIGluIHRoaXMudGVzdHMpIHtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy50ZXN0c1tpXS5nZXRDb21wbGV0ZWRQcm9taXNlKCkpO1xuICAgfVxuXG4gICByZXR1cm4gUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBbZmFpbGVkT25seT1mYWxzZV1cbiAqIEByZXR1cm5zIHtTZWN0aW9uRXhwb3J0fVxuICovXG4vL25vaW5zcGVjdGlvbiBSZXNlcnZlZFdvcmRBc05hbWVcblNlY3Rpb24ucHJvdG90eXBlLmdldERhdGEgPSBmdW5jdGlvbiBnZXREYXRhKGZhaWxlZE9ubHkpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAgICAgICovdCwgLyoqIEB0eXBlIHtUZXN0VW5pdFtdfSAqL3Rlc3RzO1xuXG4gICB0ZXN0cyA9IFtdO1xuICAgZmFpbGVkT25seSA9IGZhaWxlZE9ubHkgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogZmFpbGVkT25seTtcblxuICAgZm9yICh0IGluIHRoaXMudGVzdHMpIHtcblxuICAgICAgaWYgKGZhaWxlZE9ubHkpIGlmICh0aGlzLnRlc3RzW3RdLmlzU3VjY2Vzc2Z1bCgpKSBjb250aW51ZTtcblxuICAgICAgdGVzdHMucHVzaCh0aGlzLnRlc3RzW3RdLmdldERhdGEoKSk7XG4gICB9XG5cbiAgIHJldHVybiB7IHRlc3RzOiB0ZXN0cyxcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlXG4gICB9O1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuZ2V0RGVzY3JpcHRpb24gPSBmdW5jdGlvbiBnZXREZXNjcmlwdGlvbigpIHtcbiAgIHJldHVybiB0aGlzLmRlc2NyaXB0aW9uO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge0RPTVNlY3Rpb259XG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLmdldERPTSA9IGZ1bmN0aW9uIGdldERPTSgpIHtcbiAgIHJldHVybiB0aGlzLmRvbVNlY3Rpb247XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtEYXRlfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRFbmREYXRlID0gZnVuY3Rpb24gZ2V0RW5kRGF0ZSgpIHtcbiAgIGlmICh0aGlzLnRlc3RzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgdGhpcy50ZXN0c1t0aGlzLnRlc3RzLmxlbmd0aCAtIDFdLmdldEVuZERhdGUoKTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ8dW5kZWZpbmVkfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRFbmRUaW1lID0gZnVuY3Rpb24gZ2V0RW5kVGltZSgpIHtcbiAgIHJldHVybiB0aGlzLnByb2plY3QuZ2V0VGltZSh0aGlzLmdldEVuZERhdGUoKSk7XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtEYXRlfVxuICpcbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuZ2V0U3RhcnREYXRlID0gZnVuY3Rpb24gZ2V0U3RhcnREYXRlKCkge1xuICAgaWYgKHRoaXMudGVzdHMubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICByZXR1cm4gdGhpcy50ZXN0c1swXS5nZXRTdGFydERhdGUoKTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLmdldFN0YXJ0VGltZSA9IGZ1bmN0aW9uIGdldFN0YXJ0VGltZSgpIHtcbiAgIHJldHVybiB0aGlzLnByb2plY3QuZ2V0VGltZSh0aGlzLmdldFN0YXJ0RGF0ZSgpKTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtUZXN0VW5pdFtdfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRUZXN0cyA9IGZ1bmN0aW9uIGdldFRlc3RzKCkge1xuICAgcmV0dXJuIHRoaXMudGVzdHMuc2xpY2UoMCk7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgdGl0bGUgb2YgdGhlIHNlY3Rpb25cbiAqIEByZXR1cm5zIHtzdHJpbmd8dW5kZWZpbmVkfVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5nZXRUaXRsZSA9IGZ1bmN0aW9uIGdldFRpdGxlKCkge1xuICAgcmV0dXJuICF0aGlzLnRpdGxlID8gJycgOiB0aGlzLnRpdGxlO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLmhhc0FzeW5jVGVzdHMgPSBmdW5jdGlvbiBoYXNBc3luY1Rlc3RzKCkge1xuXG4gICB2YXIgLyoqIEB0eXBlIHtudW1iZXJ9ICovdDtcblxuICAgaWYgKHRoaXMuYXN5bmNUZXN0cyAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcblxuICAgZm9yICh0IGluIHRoaXMudGVzdHMpIHtcbiAgICAgIGlmICh0aGlzLnRlc3RzW3RdLmhhc0FzeW5jVGVzdHMoKSkge1xuICAgICAgICAgdGhpcy5hc3luY1Rlc3RzID0gdHJ1ZTtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgfVxuXG4gICByZXR1cm4gZmFsc2U7XG59O1xuXG5TZWN0aW9uLnByb3RvdHlwZS5oYXNGaW5pc2hlZCA9IGZ1bmN0aW9uIGhhc0ZpbmlzaGVkKCkge1xuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL2k7XG5cbiAgIGlmICh0aGlzLl9oYXNGaW5pc2hlZCkgcmV0dXJuIHRoaXMuX2hhc0ZpbmlzaGVkO1xuXG4gICBmb3IgKGkgaW4gdGhpcy50ZXN0cykge1xuICAgICAgaWYgKCF0aGlzLnRlc3RzW2ldLmhhc0ZpbmlzaGVkKCkpIHJldHVybiBmYWxzZTtcbiAgIH1cblxuICAgdGhpcy5faGFzRmluaXNoZWQgPSB0cnVlO1xuXG4gICByZXR1cm4gdGhpcy5faGFzRmluaXNoZWQ7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuaXNEZWZhdWx0ID0gZnVuY3Rpb24gaXNEZWZhdWx0KCkge1xuICAgcmV0dXJuIHRoaXMuZGVmYXVsdFNlY3Rpb247XG59O1xuXG4vKipcbiAqICBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuU2VjdGlvbi5wcm90b3R5cGUuaXNTdWNjZXNzZnVsID0gZnVuY3Rpb24gaXNTdWNjZXNzZnVsKCkge1xuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAgKi9pO1xuXG4gICBpZiAoIXRoaXMuaGFzRmluaXNoZWQoKSkgcmV0dXJuIGZhbHNlO1xuXG4gICBmb3IgKGkgaW4gdGhpcy50ZXN0cykge1xuICAgICAgaWYgKCF0aGlzLnRlc3RzW2ldLmlzU3VjY2Vzc2Z1bCgpKSByZXR1cm4gZmFsc2U7XG4gICB9XG5cbiAgIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0RPTVNlY3Rpb259IGRvbVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5zZXRET00gPSBmdW5jdGlvbiBzZXRET00oZG9tKSB7XG4gICB0aGlzLmRvbVNlY3Rpb24gPSBkb207XG59O1xuXG4vKipcbiogQHJldHVybnMge1Byb21pc2V9XG4qL1xuU2VjdGlvbi5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uICgpIHtcbiAgIHRoaXMuX2hhc0ZpbmlzaGVkID0gZmFsc2U7XG4gICByZXR1cm4gUHJvbWlzZS5wcm90b3R5cGUudGhlbi5hcHBseSh0aGlzLmdldFByb21pc2UoKSwgYXJndW1lbnRzKTtcbn07XG5cblNlY3Rpb24ubWF4SUQgPSAwO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBTZWN0aW9uO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2VjdGlvbi5qcy5tYXBcbiIsIid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gICB2YWx1ZTogdHJ1ZVxufSk7XG5cbnZhciBfcHJpdmF0ZSA9IHJlcXVpcmUoJy4vcHJpdmF0ZScpO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Rlc3RVbml0fSB0ZXN0XG4gKiBAY29uc3RydWN0b3JcbiAqIEBjbGFzcyBUZXN0RXhlY3V0aW9uXG4gKiBAcHJvcGVydHkge1Rlc3RDb250ZXh0fSBjaGlsZENvbnRleHRcbiAqIEBwcm9wZXJ0eSB7RGF0ZX0gICAgIHN0YXJ0RGF0ZVxuICogQHByb3BlcnR5IHtEYXRlfSAgICAgZW5kRGF0ZVxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gZXhlY3V0aW9uRnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSB7VGVzdFVuaXR9IHRlc3RcbiAqL1xudmFyIFRlc3RFeGVjdXRpb24gPSBmdW5jdGlvbiBUZXN0RXhlY3V0aW9uKHRlc3QpIHtcbiAgIHRoaXMudGVzdCA9IHRlc3Q7XG4gICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRoaXMudGVzdC5nZXRUZXN0RnVuY3Rpb24oKTtcbiAgIHRoaXMuY2hpbGRDb250ZXh0ID0gdGhpcy50ZXN0LmNoaWxkQ29udGV4dDtcbiAgIHRoaXMuYXN5bmMgPSB0aGlzLnRlc3QuYXN5bmM7XG4gICB0aGlzLmNvbnRleHQgPSB0aGlzLnRlc3QuY29udGV4dDtcbn07XG5cblRlc3RFeGVjdXRpb24ucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiBkb25lKCkge1xuICAgdGhpcy5lbmREYXRlID0gbmV3IERhdGUoKTtcbn07XG5cbi8qKlxuICogRXhlY3V0ZSB0aGUgZnVuY3Rpb25cbiAqL1xuVGVzdEV4ZWN1dGlvbi5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG5cbiAgIHZhciAvKiogQHR5cGUgeyp9ICAgICAgICAgICAgICAgICAgICovZXJyLCAvKiogQHR5cGUge1RoaXNUZXN0Q29udGV4dEluZm99ICovb2xkSW5mbywgLyoqIEB0eXBlIHtBcnJheX0gICAgICAgICAgICAgICAqL3BhcmFtcztcblxuICAgLy8gQnVpbGRpbmcgcGFyYW1ldGVycyBmb3IgdGhlIGZ1bmN0aW9uIDpcbiAgIC8vIFRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgdGhlIFwidGVzdFwiIGZ1bmN0aW9uXG4gICAvLyBUaGUgc2Vjb25kIHBhcmFtZXRlciBpcyB0aGUgZmlyc3QgYXJndW1lbnQgcHJvdmlkZWQgdG8gdGhlIGV4ZWN1dGUgZnVuY3Rpb24uXG4gICBwYXJhbXMgPSBbdGhpcy50ZXN0LmNoaWxkQ29udGV4dF07XG5cbiAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSBwYXJhbXMucHVzaChhcmd1bWVudHNbMF0pO1xuXG4gICAvLyBXZSBoYXZlIHRvIGNoYW5nZSB0aGUgY29udGV4dCBvZiB0aGUgXCJ0ZXN0XCIgZnVuY3Rpb25cbiAgIG9sZEluZm8gPSB0aGlzLmNvbnRleHQuaW5mbztcblxuICAgLy9ub2luc3BlY3Rpb24gSlNWYWxpZGF0ZVR5cGVzXG4gICB0aGlzLmNvbnRleHQucmVzZXQoX3ByaXZhdGUudG9rZW4sIHRoaXMuY2hpbGRDb250ZXh0Ll9pbmZvKF9wcml2YXRlLnRva2VuKSk7XG5cbiAgIHRoaXMuc3RhcnREYXRlID0gbmV3IERhdGUoKTtcbiAgIHRyeSB7XG4gICAgICB0aGlzLnJlc3VsdCA9IHRoaXMudGVzdEZ1bmN0aW9uLmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtcbiAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy50aHJvd0Vycm9yID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXJyb3IgPSBlcnI7XG4gICB9XG5cbiAgIGlmICh0aGlzLnJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHRoaXMucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgLy8gTm90ZSA6IGVuZERhdGUgY291bGQgYmUgYWxyZWFkeSBkZWZpbmVkIGlmIHRoZSBcImRvbmVcIiBmdW5jdGlvbiBoYXMgYmVlbiB0cmlnZ2VyZWRcbiAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZSA9PT0gdW5kZWZpbmVkID8gbmV3IERhdGUoKSA6IHRoaXMuZW5kRGF0ZTtcbiAgICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0O1xuICAgICAgfS5iaW5kKHRoaXMpLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZSA9PT0gdW5kZWZpbmVkID8gbmV3IERhdGUoKSA6IHRoaXMuZW5kRGF0ZTtcbiAgICAgICAgIHRoaXMudGhyb3dFcnJvciA9IHRydWU7XG4gICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICB9LmJpbmQodGhpcykpO1xuICAgfSBlbHNlXG4gICAgICAvLyBOb3RlIDogZW5kRGF0ZSBjb3VsZCBiZSBhbHJlYWR5IGRlZmluZWQgaWYgdGhlIFwiZG9uZVwiIGZ1bmN0aW9uIGhhcyBiZWVuIHRyaWdnZXJlZFxuICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlID09PSB1bmRlZmluZWQgPyBuZXcgRGF0ZSgpIDogdGhpcy5lbmREYXRlO1xuXG4gICB0aGlzLmNvbnRleHQucmVzZXQoX3ByaXZhdGUudG9rZW4sIG9sZEluZm8pO1xuXG4gICByZXR1cm4gdGhpcy5yZXN1bHQ7XG59O1xuXG4vKipcbiAqIEluZGljYXRlIGlmIHRoZSB0ZXN0IGZ1bmN0aW9uIChhbmQgaXQncyBldmVudHVhbCByZXR1cm4gcHJvbWlzZXMpIGhhcyBmaW5pc2hlZCAodHJ1ZSkgb3Igbm90IChmYWxzZSlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5UZXN0RXhlY3V0aW9uLnByb3RvdHlwZS5oYXNGaW5pc2hlZCA9IGZ1bmN0aW9uIGhhc0ZpbmlzaGVkKCkge1xuICAgcmV0dXJuIHRoaXMuZW5kRGF0ZSAhPT0gdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGR1cmF0aW9uIG9mIHRoZSBleGVjdXRpb24uXG4gKiBJZiB0aGUgdGVzdCBoYXNuJ3QgZmluaXNoZWQsIHRoZW4gcmV0dXJuIHVuZGVmaW5lZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VudGlsTm93PWZhbHNlXSBJZiB0cnVlLCB0aGVuIGlmIHdpbGwgdXNlIHRoZSBjdXJyZW50IGRhdGUgaW5zdGVhZCBvZiB0aGUgZW5kIGRhdGUgaWYgdGhlIGZ1bmN0aW9uIGhhc24nbnQgZmluaXNoZWQgeWV0XG4gKiBAcmV0dXJucyB7bnVtYmVyfHVuZGVmaW5lZH1cbiAqL1xuVGVzdEV4ZWN1dGlvbi5wcm90b3R5cGUuZ2V0RHVyYXRpb24gPSBmdW5jdGlvbiBnZXREdXJhdGlvbih1bnRpbE5vdykge1xuXG4gICB2YXIgLyoqKiBAdHlwZSB7bnVtYmVyfSAqL2VuZERhdGU7XG5cbiAgIGVuZERhdGUgPSB0aGlzLmVuZERhdGUgIT09IHVuZGVmaW5lZCA/IHRoaXMuZW5kRGF0ZSA6IHVudGlsTm93ID8gRGF0ZS5ub3coKSA6IHVuZGVmaW5lZDtcblxuICAgaWYgKGVuZERhdGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgcmV0dXJuIGVuZERhdGUgLSB0aGlzLnN0YXJ0RGF0ZTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtEYXRlfVxuICovXG5UZXN0RXhlY3V0aW9uLnByb3RvdHlwZS5nZXRFbmREYXRlID0gZnVuY3Rpb24gZ2V0RW5kRGF0ZSgpIHtcbiAgIHJldHVybiB0aGlzLmVuZERhdGU7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7RGF0ZX1cbiAqL1xuVGVzdEV4ZWN1dGlvbi5wcm90b3R5cGUuZ2V0U3RhcnREYXRlID0gZnVuY3Rpb24gZ2V0U3RhcnREYXRlKCkge1xuICAgcmV0dXJuIHRoaXMuc3RhcnREYXRlO1xufTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gVGVzdEV4ZWN1dGlvbjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRlc3RFeGVjdXRpb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICAgICAgICAgICAgICAgdmFsdWU6IHRydWVcbn0pO1xuLyoqXG4gKiBAdHlwZWRlZiB7UHJvbWlzZX0gVGVzdFByb21pc2VcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259ICAgIGNvbW1lbnRcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259ICAgIGRlc2NyaWJlXG4gKiBAcHJvcGVydHkge1Rlc3RQcm9taXNlfSBub3RcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259ICAgIHRvZG9cbiAqXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fVxuICogQG5hbWUgVGVzdFVuaXRQYXJhbWV0ZXJzXG4gKlxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgICBhc3luY1xuICogQHByb3BlcnR5IHtUZXN0Q29udGV4dH0gICAgICAgICBjb250ZXh0XG4gKiBAcHJvcGVydHkge251bWJlcn0gICAgICAgICAgICAgIGV4ZWN1dGlvbkRlbGF5XG4gKiBAcHJvcGVydHkge1Rlc3RVbml0fFNlY3Rpb259ICAgIHBhcmVudFxuICogQHByb3BlcnR5IHtQcm9qZWN0fSAgICAgICAgICAgICBwcm9qZWN0XG4gKiBAcHJvcGVydHkge3N0cmluZ3x1bmRlZmluZWR9ICAgIHByb21pc2VSb2xlXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICAgIHN0cmljdFxuICogQHByb3BlcnR5IHtUZXN0Q29udGV4dH0gICAgICAgICB0ZXN0RnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICAgICAgdGl0bGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSAgICAgICAgICAgICAgdGltZW91dFxuICpcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFRlc3RUeXBlUGFyYW1ldGVyXG4gKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgICAgICBuYW1lXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uOiBib29sZWFufSB0ZXN0XG4gKiBAcHJvcGVydHkge2Z1bmN0aW9uOiBib29sZWFufSBzdHJpY3RcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICAgIG9uZXJyb3JcbiAqXG4gKi9cblxuLyoqXG4gKiBAcGFyYW0ge1Rlc3RUeXBlUGFyYW1ldGVyfSBwYXJhbWV0ZXJzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBjbGFzcyBUZXN0VHlwZVxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgIG5hbWVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24pICAgICAgICBvcGVyYXRpb25cbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24pICAgICAgICBzdHJpY3RPcGVyYXRpb25cbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb246c3RyaW5nfSB0b1N0cmluZ1xuICogQHByb3BlcnR5IHtib29sZWFufVxuICovXG52YXIgVGVzdFR5cGUgPSBmdW5jdGlvbiBUZXN0VHlwZShwYXJhbWV0ZXJzKSB7XG4gICAgICAgICAgICAgICB0aGlzLm5hbWUgPSBwYXJhbWV0ZXJzLm5hbWU7XG4gICAgICAgICAgICAgICB0aGlzLnRlc3QgPSBwYXJhbWV0ZXJzLnRlc3Q7XG4gICAgICAgICAgICAgICB0aGlzLnN0cmljdFRlc3QgPSBwYXJhbWV0ZXJzLnN0cmljdDtcbiAgICAgICAgICAgICAgIHRoaXMub25lcnJvciA9IHBhcmFtZXRlcnMub25lcnJvciA9PT0gdW5kZWZpbmVkID8gZmFsc2UgOiBwYXJhbWV0ZXJzLm9uZXJyb3I7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge1Rlc3RUeXBlUGFyYW1ldGVyfSBwYXJhbWV0ZXJzXG4gKi9cblRlc3RUeXBlLmFkZCA9IGZ1bmN0aW9uIGFkZChwYXJhbWV0ZXJzKSB7XG5cbiAgICAgICAgICAgICAgIHZhciAvKiogQHR5cGUge1Rlc3RUeXBlfSAqL3Rlc3RUeXBlO1xuXG4gICAgICAgICAgICAgICB0ZXN0VHlwZSA9IG5ldyBUZXN0VHlwZShwYXJhbWV0ZXJzKTtcblxuICAgICAgICAgICAgICAgVGVzdFR5cGUuYWxsW3Rlc3RUeXBlLm5hbWVdID0gdGVzdFR5cGU7XG59O1xuXG4vKipcbiAqXG4gKiBAdHlwZSB7T2JqZWN0LjxUZXN0VHlwZT59XG4gKi9cblRlc3RUeXBlLmFsbCA9IHt9O1xuXG5UZXN0VHlwZS5hZGQoeyBuYW1lOiAnY29udGFpbnMnLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gY29udGFpbnMoYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuaW5kZXhPZihiKTtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdlcXVhbCcsXG4gICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiBlcXVhbChhLCBiLCBjKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PSAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IGMgOiBiKTtcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBzdHJpY3Q6IGZ1bmN0aW9uIGVxdWFsKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID09PSAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IGMgOiBiKTtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc0JldHdlZW4nLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNCZXR3ZWVuKGEsIGIsIGMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID49IGIgJiYgYSA8PSBjO1xuICAgICAgICAgICAgICAgfSB9KTtcblxuVGVzdFR5cGUuYWRkKHsgbmFtZTogJ2lzRGVmaW5lZCcsXG4gICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiBpc0RlZmluZWQoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgIT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgIHN0cmljdDogZnVuY3Rpb24gaXNEZWZpbmVkKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhICE9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICB9IH0pO1xuXG5UZXN0VHlwZS5hZGQoeyBuYW1lOiAnaXNEaWZmZXJlbnRUaGFuJyxcbiAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIGlzRGlmZmVyZW50VGhhbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSAhPSBiO1xuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgIHN0cmljdDogZnVuY3Rpb24gaXNEaWZmZXJlbnRUaGFuKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhICE9PSBiO1xuICAgICAgICAgICAgICAgfSB9KTtcblxuVGVzdFR5cGUuYWRkKHsgbmFtZTogJ2lzRmFsc2UnLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNGYWxzZShhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBzdHJpY3Q6IGZ1bmN0aW9uIGlzRmFsc2UoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPT09IGZhbHNlO1xuICAgICAgICAgICAgICAgfSB9KTtcblxuVGVzdFR5cGUuYWRkKHsgbmFtZTogJ2lzR3JlYXRlck9yRXF1YWxUaGFuJyxcbiAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIGlzR3JlYXRlck9yRXF1YWxUaGFuKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID49IGI7XG4gICAgICAgICAgICAgICB9IH0pO1xuXG5UZXN0VHlwZS5hZGQoeyBuYW1lOiAnaXNHcmVhdGVyVGhhbicsXG4gICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiBpc0dyZWF0ZXJUaGFuKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID4gYjtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc0luc3RhbmNlT2YnLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNJbnN0YW5jZU9mKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhIGluc3RhbmNlb2YgYjtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc0xlc3Nlck9yRXF1YWxUaGFuJyxcbiAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIGlzTGVzc2VyT3JFcXVhbFRoYW4oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPD0gYjtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc0xlc3NlclRoYW4nLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNMZXNzZXJUaGFuKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhIDwgYjtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc051bGwnLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNOdWxsKGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID09IG51bGw7XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgc3RyaWN0OiBmdW5jdGlvbiBpc051bGwoYSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEgPT09IG51bGw7XG4gICAgICAgICAgICAgICB9IH0pO1xuXG5UZXN0VHlwZS5hZGQoeyBuYW1lOiAnaXNUcnVlJyxcbiAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIGlzVHJ1ZShhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICBzdHJpY3Q6IGZ1bmN0aW9uIGlzVHJ1ZShhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PT0gdHJ1ZTtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICdpc1VuZGVmaW5lZCcsXG4gICAgICAgICAgICAgICB0ZXN0OiBmdW5jdGlvbiBpc1VuZGVmaW5lZChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgc3RyaWN0OiBmdW5jdGlvbiBpc1VuZGVmaW5lZChhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgfSB9KTtcblxuVGVzdFR5cGUuYWRkKHsgbmFtZTogJ3Rocm93VmFsdWUnLFxuICAgICAgICAgICAgICAgb25lcnJvcjogdHJ1ZSxcbiAgICAgICAgICAgICAgIHRlc3Q6IGZ1bmN0aW9uIGlzVW5kZWZpbmVkKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhID09IGI7XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgc3RyaWN0OiBmdW5jdGlvbiBpc1VuZGVmaW5lZChhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgICAgICAgICAgIH0gfSk7XG5cblRlc3RUeXBlLmFkZCh7IG5hbWU6ICd0aHJvdycsXG4gICAgICAgICAgICAgICBvbmVycm9yOiB0cnVlLFxuICAgICAgICAgICAgICAgdGVzdDogZnVuY3Rpb24gaXNVbmRlZmluZWQoZXJyb3JSYWlzZWQsIGVycm9ySW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBlcnJvclJhaXNlZCBpbnN0YW5jZW9mIGVycm9ySW5zdGFuY2U7XG4gICAgICAgICAgICAgICB9IH0pO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBUZXN0VHlwZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVRlc3RUeXBlLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgIHZhbHVlOiB0cnVlXG59KTtcblxudmFyIF9Db250ZXh0ID0gcmVxdWlyZSgnLi9Db250ZXh0Jyk7XG5cbnZhciBfQ29udGV4dDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9Db250ZXh0KTtcblxudmFyIF9TZWN0aW9uID0gcmVxdWlyZSgnLi9TZWN0aW9uJyk7XG5cbnZhciBfU2VjdGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9TZWN0aW9uKTtcblxudmFyIF9UZXN0RXhlY3V0aW9uID0gcmVxdWlyZSgnLi9UZXN0RXhlY3V0aW9uJyk7XG5cbnZhciBfVGVzdEV4ZWN1dGlvbjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UZXN0RXhlY3V0aW9uKTtcblxudmFyIF9UZXN0VHlwZSA9IHJlcXVpcmUoJy4vVGVzdFR5cGUnKTtcblxudmFyIF9UZXN0VHlwZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9UZXN0VHlwZSk7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxudmFyIF9mdW5jdGlvbnMgPSByZXF1aXJlKCcuL2Z1bmN0aW9ucycpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG4vKipcbiAqIEBwYXJhbSB7VGVzdFVuaXRQYXJhbWV0ZXJzfSBwYXJhbVxuICogQGNvbnN0cnVjdG9yXG4gKiBAY2xhc3MgVGVzdFVuaXRcbiAqIEBleHRlbmQge1Byb21pc2UuPFI+fVxuICogQHByb3BlcnR5IHtib29sZWFufHVuZGVmaW5lZH0gX2hhc0ZpbmlzaGVkICAgICAgICAgLSBJbmRpY2F0ZSB3ZWl0aGVyICh0cnVlKSBvciBub3QgKGZhbHNlKSB0aGUgdGVzdCwgYW5kIGFsbCBpdCdzIGNoaWxkIHRlc3RzIGhhdmUgZW5kXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICBfaGFzVW5pdFRlc3RGaW5pc2hlZFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgX2lzQ2xvc2VkICAgICAgICAgICAgLSBJZiB0cnVlLCB0aGUgdGhlIHRlc3QgaXMgY2xvc2VkLiBGYWxzZSBvdGhlciB3aXNlLiBBIGNsb3NlZCB0ZXN0IGNhbid0IGhhdmUgbmV3IGNoaWxkIHRlc3RzXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICBhc3luY1xuICogQHByb3BlcnR5IHtib29sZWFufHVuZGVmaW5lZH0gYXN5bmNUZXN0c1xuICogQHByb3BlcnR5IHtUZXN0VW5pdFtdfSAgICAgICAgY2F0Y2hUZXN0cyAgICAgICAgICAgLSBMaXN0IG9mIGFsbCBcImNhdGNoXCIgdGVzdHNcbiAqIEBwcm9wZXJ0eSB7VGVzdENvbnRleHR9ICAgICAgIGNoaWxkQ29udGV4dFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgY29tbWVudFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgY2FsY3VsYXRlZFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgY29tcGxldGVkXG4gKiBAcHJvcGVydHkge0RhdGV9ICAgICAgICAgICAgICBjcmVhdGlvbkRhdGUgICAgICAgICAtIERhdGUgb2YgY3JlYXRpb24gb2YgdGhlIHRlc3RcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICAgIGRlc2NyaXB0aW9uXG4gKiBAcHJvcGVydHkge0RPTVRlc3R9ICAgICAgICAgICBkb21UZXN0XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICBkdXJhdGlvblJlc3VsdFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgZW5hYmxlZFxuICogQHByb3BlcnR5IHtib29sZWFufSAgICAgICAgICAgZXJyb3JFeHBlY3RlZFxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gICAgICAgICAgZnVsbGZpbGxQcm9taXNlICAgICAgLSBGdWxsZmlsbCBmdW5jdGlvbiBvZiB0aGUgdGVzdCBwcm9taXNlIDogaXQgd2lsbCBiZSBleGVjdXRlZCBieSB0aGUgZnVsbGZpbGxUZXN0IGZ1bmN0aW9uXG4gKiBAcHJvcGVydHkge1Rlc3RVbml0W119ICAgICAgICBuZXh0cyAgICAgICAgICAgICAgICAtIFRlc3QgZXhlY3V0ZWQgcmlnaHQgYWZ0ZXIgdGhpcyBvbmUsIHVzaW5nIHRoZSB0aGVuL2NhdGNoIGZ1bmN0aW9uXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICBub3RNb2RlXG4gKiBAcHJvcGVydHkge1Rlc3RVbml0fFNlY3Rpb259ICBwYXJlbnRcbiAqIEBwcm9wZXJ0eSB7UHJvamVjdH0gICAgICAgICAgIHByb2plY3RcbiAqIEBwcm9wZXJ0eSB7UHJvbWlzZX0gICAgICAgICAgIHByb21pc2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfHVuZGVmaW5lZH0gIHByb21pc2VSb2xlXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSAgICAgICAgICBwcm9taXNlVGhlbkZ1bmN0aW9uICAtIE9yaWdpbmFsIFwidGhlblwiIGZ1bmN0aW9uIG9mIHRoZSBwcm9taXNlLlxuICogQHByb3BlcnR5IHtmdW5jdGlvbn0gICAgICAgICAgcmVqZWN0UHJvbWlzZSAgICAgICAgLSBSZWplY3QgZnVuY3Rpb24gb2YgdGhlIHRlc3QgcHJvbWlzZSA6IGl0IHdpbGwgYmUgZXhlY3V0ZWQgYnkgdGhlIHJlamVjdCB0ZXN0IGZ1bmN0aW9uXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICByZXN1bHRcbiAqIEBwcm9wZXJ0eSB7U2VjdGlvbltdfSAgICAgICAgIHNlY3Rpb25zXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgICBzdHJpY3RNb2RlXG4gKiBAcHJvcGVydHkge1Rlc3RFeGVjdXRpb259ICAgICB0ZXN0RXhlY3V0aW9uXG4gKiBAcHJvcGVydHkge2Z1bmN0aW9ufSAgICAgICAgICB0ZXN0RnVuY3Rpb25cbiAqIEBwcm9wZXJ0eSB7QXJyYXl9ICAgICAgICAgICAgIHRlc3RQYXJhbWV0ZXJzICAgICAgIC0gVGhlIHBhcmFtZXRlciB0byBwcm92aWRlIHRvIHRoZSB0ZXN0aW5nIGZ1bmN0aW9uIChleDogWzEwXSBmb3IgdGhlIFwidG9CZUdyZWF0ZXJUaGFuXCIgdGVzdClcbiAqIEBwcm9wZXJ0eSB7QXJyYXl9ICAgICAgICAgICAgIHRlc3RQYXJhbWV0ZXJzRXhwb3J0IC0gQ29weSBvZiB0aGUgdGVzdFBhcmFtZXRlciBhdHRyaWJ1dGUgdGhhdCB3aWxsIGJlIHVzZWQgZm9yIHRoZSBleHBvcnQuXG4gKiBAcHJvcGVydHkge1Rlc3RUeXBlfSAgICAgICAgICB0ZXN0VHlwZVxuICogQHByb3BlcnR5IHtudW1iZXJ8dW5kZWZpbmVkfSAgdGltZW91dCAgICAgICAgICAgICAgLSBJZiBwcm92aWRlZCwgdGhlbiBjb3JyZXNwb25kIHRvIHRoZSBtYXhpbXVtIGR1cmF0aW9uIG9mIHRoZSB0ZXN0IGZ1bmN0aW9uLiBBZnRlciB0aGF0LCB0aGUgdGVzdCB3aWxsIGJlIGNvbnNpZGVyZWQgaGFzIGZhaWxlZFxuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgcHJvbWlzZVJvbGUgICAgICAgICAgLSBSb2xlIG9mIHRoZSB0ZXN0IHJlbGF0aXZlbHkgdG8gdGhlIHBhcmVudCB0ZXN0IHByb21pc2UuIENvdWxkIGJlIHVuZGVmaW5lZCwgXCJ0aGVuXCIgb3IgXCJjYXRjaFwiLlxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gICAgICAgICAgdG9Eb0xpc3QgICAgICAgICAgICAgLSBDb250YWluIGFsbCB0b2Rvc1xuICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICAgdGl0bGVcbiAqL1xudmFyIFRlc3RVbml0ID0gZnVuY3Rpb24gVGVzdFVuaXQocGFyYW0pIHtcblxuICAgdGhpcy5jYXRjaFRlc3RzID0gW107XG4gICB0aGlzLmNhbGN1bGF0ZWQgPSBmYWxzZTtcbiAgIHRoaXMuY29tbWVudHMgPSBbXTtcbiAgIHRoaXMuY29tcGxldGVkID0gZmFsc2U7XG4gICB0aGlzLmNvbnRleHQgPSBwYXJhbS5jb250ZXh0O1xuICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgdGhpcy5lbmFibGVkID0gcGFyYW0uZW5hYmxlZDtcbiAgIHRoaXMuaWQgPSBUZXN0VW5pdC5sYXN0SWQrKztcbiAgIHRoaXMubmV4dHMgPSBbXTtcbiAgIHRoaXMubm90TW9kZSA9IGZhbHNlO1xuICAgdGhpcy5wYXJlbnQgPSBwYXJhbS5wYXJlbnQ7XG4gICB0aGlzLnByb21pc2VSb2xlID0gcGFyYW0ucHJvbWlzZVJvbGU7XG4gICB0aGlzLnByb2plY3QgPSBwYXJhbS5wcm9qZWN0O1xuICAgdGhpcy50aW1lb3V0ID0gcGFyYW0udGltZW91dDtcbiAgIHRoaXMuc3RyaWN0TW9kZSA9IHBhcmFtLnN0cmljdDtcbiAgIHRoaXMudGVzdHMgPSBbXTtcbiAgIHRoaXMudGl0bGUgPSBwYXJhbS50aXRsZTtcbiAgIHRoaXMudmFsdWUgPSBwYXJhbS52YWx1ZTtcbiAgIHRoaXMuZXhlY3V0aW9uRGVsYXkgPSBwYXJhbS5leGVjdXRpb25EZWxheTtcbiAgIHRoaXMuZXJyb3JFeHBlY3RlZCA9IGZhbHNlO1xuICAgdGhpcy50b0RvTGlzdCA9IFtdO1xuICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgIHRoaXMudGVzdFR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgIHRoaXMubm90ZXMgPSBbXTtcblxuICAgdGhpcy5hc3luYyA9IHBhcmFtLmFzeW5jIHx8IHRoaXMuZXhlY3V0aW9uRGVsYXkgIT09IGZhbHNlIHx8IHRoaXMudmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRoaXMudmFsdWUgaW5zdGFuY2VvZiBUZXN0VW5pdDtcblxuICAgdGhpcy5faXNDbG9zZWQgPSBmYWxzZTtcblxuICAgdGhpcy5yZXN1bHRzID0geyBlcnJvcjogdW5kZWZpbmVkLFxuICAgICAgdGVzdDogdW5kZWZpbmVkLFxuICAgICAgdGltZW91dDogdW5kZWZpbmVkLFxuICAgICAgdmFsaWRpdHk6IHVuZGVmaW5lZFxuXG4gICAgICAvLyBUaGVzZXMgYXJlIHRoZSB2YWx1ZXMgcmV0dXJuIGJ5IHRoZSBcImNvdW50XCIgZnVuY3Rpb25zLiBUaGV5IGFyZSB1cGRhdGVkIGJ5IHRoZSBcInJlZnJlc2hcIiBmdW5jdGlvbi5cbiAgICAgICwgY291bnQ6IHsgZXJyb3JzOiAwLFxuICAgICAgICAgZmFpbHM6IDAsXG4gICAgICAgICBzdWNjZXNzZXM6IDAsXG4gICAgICAgICB0b3RhbDogMCB9IH07XG5cbiAgIC8vIENoaWxkIHRlc3RzXG4gICB0aGlzLmNoaWxkQ29udGV4dCA9ICgwLCBfQ29udGV4dDIuZGVmYXVsdCkodGhpcyk7XG4gICB0aGlzLmN1cnJlbnRTZWN0aW9uID0gbmV3IF9TZWN0aW9uMi5kZWZhdWx0KHRoaXMucHJvamVjdCwgJycsIHRydWUsIHRoaXMpO1xuICAgdGhpcy5zZWN0aW9ucyA9IFt0aGlzLmN1cnJlbnRTZWN0aW9uXTtcblxuICAgaWYgKHR5cGVvZiB0aGlzLnZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnRlc3RGdW5jdGlvbiA9IHRoaXMudmFsdWU7XG4gICAgICB0aGlzLnRlc3RFeGVjdXRpb24gPSBuZXcgX1Rlc3RFeGVjdXRpb24yLmRlZmF1bHQodGhpcyk7XG4gICB9XG5cbiAgIGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XG5cbiAgIHRoaXMuYnVpbGRQcm9taXNlKCk7XG5cbiAgIHRoaXMuZXhlY3V0ZSgpO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge1Byb21pc2V9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5idWlsZFByb21pc2UgPSBmdW5jdGlvbiBidWlsZFByb21pc2UoKSB7XG5cbiAgIHZhciAvKiogQHR5cGUge3N0cmluZ30gICovbmFtZTtcblxuICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKGZ1bGxmaWxsLCByZWplY3QpIHtcbiAgICAgIHRoaXMuZnVsbGZpbGxQcm9taXNlID0gZnVsbGZpbGw7XG4gICAgICB0aGlzLnJlamVjdFByb21pc2UgPSByZWplY3Q7XG4gICB9LmJpbmQodGhpcykpO1xuXG4gICB0aGlzLnByb21pc2VUaGVuRnVuY3Rpb24gPSB0aGlzLnByb21pc2UudGhlbi5iaW5kKHRoaXMucHJvbWlzZSk7XG5cbiAgIGZvciAobmFtZSBpbiBfVGVzdFR5cGUyLmRlZmF1bHQuYWxsKSB7XG4gICAgICB0aGlzLnByb21pc2VbbmFtZV0gPSBfZnVuY3Rpb25zLmJ1aWxkVGVzdF9leGVjdXRlLmJpbmQoeyB0ZXN0OiB0aGlzLCB0eXBlOiBfVGVzdFR5cGUyLmRlZmF1bHQuYWxsW25hbWVdLCBwcm9taXNlOiB0aGlzLnByb21pc2UgfSk7XG4gICB9XG5cbiAgIHRoaXMucHJvbWlzZS50b2RvID0gdGhpcy50b2RvLmJpbmQodGhpcyk7XG4gICB0aGlzLnByb21pc2UuY29tbWVudCA9IHRoaXMuY29tbWVudC5iaW5kKHRoaXMpO1xuICAgdGhpcy5wcm9taXNlLmRlc2NyaWJlID0gdGhpcy5kZXNjcmliZS5iaW5kKHRoaXMpO1xuICAgdGhpcy5wcm9taXNlLm5vdGUgPSB0aGlzLm5vdGUuYmluZCh0aGlzKTtcbiAgIHRoaXMucHJvbWlzZS5nZXRSZXN1bHQgPSB0aGlzLmdldFJlc3VsdC5iaW5kKHRoaXMpO1xuICAgdGhpcy5wcm9taXNlLnRoZW4gPSB0aGlzLnRoZW4uYmluZCh0aGlzKTtcbiAgIHRoaXMucHJvbWlzZS5jYXRjaCA9IHRoaXMuY2F0Y2guYmluZCh0aGlzKTtcblxuICAgLy8gQWRkaW5nIHRoZSBcIm5vdFwiIGtleXdvcmRcbiAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnByb21pc2UsICdub3QnLCB7IGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgdGhpcy5ub3QoKTtyZXR1cm4gdGhpcy5wcm9taXNlO1xuICAgICAgfS5iaW5kKHRoaXMpIH0pO1xuXG4gICB0aGlzLnByb21pc2UuJCA9IHRoaXM7XG59O1xuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgcmVzdWx0IG9mIHRoZSB0ZXN0XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5jYWxjUmVzdWx0ID0gZnVuY3Rpb24gY2FsY1Jlc3VsdCgpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7QXJyYXl9ICAgICovcGFyYW1zLCAvKiogQHR5cGUge2Jvb2xlYW59ICAqL3Jlc3VsdCwgLyoqIEB0eXBlIHtUZXN0VHlwZX0gKi90ZXN0VHlwZSwgdmFsdWU7XG5cbiAgIGlmICh0aGlzLmVycm9yRXhwZWN0ZWQpIHZhbHVlID0gdGhpcy5lcnJvcjtlbHNlIHZhbHVlID0gdGhpcy52YWx1ZTtcblxuICAgdGVzdFR5cGUgPSB0aGlzLnRlc3RUeXBlID8gdGhpcy50ZXN0VHlwZSA6IF9UZXN0VHlwZTIuZGVmYXVsdC5hbGwuaXNUcnVlO1xuXG4gICBpZiAoIXRoaXMuaXNVbml0VGVzdCgpKSB7XG4gICAgICB0aGlzLnJlc3VsdHMudmFsaWRpdHkgPSB0aGlzLmlzVmFsaWQoKTtcbiAgICAgIHRoaXMuY2FsY3VsYXRlZCA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICB9XG5cbiAgIHRoaXMucmVzdWx0cy52YWxpZGl0eSA9IHRydWU7XG5cbiAgIC8vIENyZWF0aW5nIHBhcmFtZXRlcnMgbGlzdCBmb3IgdGhlIHRlc3QgZnVuY3Rpb25cbiAgIHBhcmFtcyA9IFt2YWx1ZV0uY29uY2F0KHRoaXMudGVzdFBhcmFtZXRlcnMpO1xuXG4gICAvLyBJZiBubyBlcnJvcnMgaGFzIGJlZW4gcmFpc2VkLCB0aGVuIHdlIGNvbnRpbnVlXG4gICBpZiAodGhpcy5yZXN1bHRzLmVycm9yICYmICF0aGlzLmVycm9yRXhwZWN0ZWQpIHJlc3VsdCA9IGZhbHNlO2Vsc2UgaWYgKHRoaXMuZXJyb3JFeHBlY3RlZCAmJiAhdGhpcy5yZXN1bHRzLmVycm9yKSByZXN1bHQgPSBmYWxzZTtlbHNlIHtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgIGlmICh0aGlzLnN0cmljdE1vZGUgJiYgdGVzdFR5cGUuc3RyaWN0VGVzdCAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSB0ZXN0VHlwZS5zdHJpY3RUZXN0LmFwcGx5KHVuZGVmaW5lZCwgcGFyYW1zKTtlbHNlIHJlc3VsdCA9IHRlc3RUeXBlLnRlc3QuYXBwbHkodW5kZWZpbmVkLCBwYXJhbXMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm5vdE1vZGUpIHJlc3VsdCA9ICFyZXN1bHQ7XG4gICB9XG5cbiAgIHRoaXMucmVzdWx0cy50ZXN0ID0gcmVzdWx0O1xuICAgdGhpcy5jYWxjdWxhdGVkID0gdHJ1ZTtcbn07XG5cbi8qKlxuICpcbiAqIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgYWZ0ZXIgdGhlIHRlc3QuXG4gKlxuICogSWYgdGhlIGZpcnN0IHBhcmFtZXRlciBpcyBhIHN0cmluZywgdGhlbiBhIG5ldyB0ZXN0IHdpbGwgYmUgY3JlYXRlZCB3aXRoIHRoZSBzdHJpbmdcbiAqIGFzIHRpdGxlIGFuZCB0aGUgc2Vjb25kIHBhcmFtZXRlciBhcyB0aGUgdGVzdC4gSW4gdGhpcyBjYXNlLCB0aGUgZnVuY3Rpb24gd2lsbCByZXR1cm5cbiAqIHRoZSBuZXdseSBjcmVhdGVkIHRlc3QgdW5pdFxuICogTm90ZSB0aGF0IGluIHRoaXMgY2FzZSwgaWYgd2UgYXJlIGFuIHN5bmMgdGVzdCwgdGhlIFwidGhlblwiIHRlc3Qgd2lsbCBiZSBleGVjdXRlZCBzeW5jaHJvbm91c2x5LlxuICpcbiAqIElmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXNuJ3QgYSBzdHJpbmcsIHRoZW4gdGhlIHN0YW5kYXJkIFwidGhlblwiIGZ1bmN0aW9uIG9mIHByb21pc2UgcGF0dGVyblxuICogd2lsbCBiZSBjYWxsZWQuIFRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgbmV3bHkgY3JlYXRlZCBwcm9taXNlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfGZ1bmN0aW9ufSBwYXJhbTFcbiAqIEBwYXJhbSB7ZnVuY3Rpb259ICAgICAgICBbcGFyYW0yXVxuICogQHJldHVybnMge1Rlc3RQcm9taXNlfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbiAocGFyYW0xLCBwYXJhbTIpIHtcbiAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgcGFyYW0xKTtlbHNlIHJldHVybiB0aGlzLnRoZW4ocGFyYW0xLCB1bmRlZmluZWQsIHBhcmFtMik7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudFxuICogQHJldHVybnMge1Rlc3RVbml0fVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuY29tbWVudCA9IGZ1bmN0aW9uIGNvbW1lbnQoY29tbWVudCkge1xuICAgdGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xuICAgcmV0dXJuIHRoaXMuZ2V0UHJvbWlzZSgpO1xufTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHtib29sZWFufSBpc0Vycm9yXG4gKiBAcGFyYW0geyp9ICAgICAgIHZhbHVlXG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5jb21wbGV0ZSA9IGZ1bmN0aW9uIGNvbXBsZXRlKGlzRXJyb3IsIHZhbHVlKSB7XG5cbiAgIHRoaXMuY29tcGxldGVkID0gdHJ1ZTtcblxuICAgaWYgKCFpc0Vycm9yICYmIHRoaXMudGVzdEV4ZWN1dGlvbikge1xuICAgICAgaXNFcnJvciA9IHRoaXMudGVzdEV4ZWN1dGlvbi50aHJvd0Vycm9yO1xuXG4gICAgICBpZiAoaXNFcnJvcikgdmFsdWUgPSB0aGlzLnRlc3RFeGVjdXRpb24uZXJyb3I7XG4gICB9XG5cbiAgIGlmIChpc0Vycm9yKSB7XG4gICAgICB0aGlzLmVycm9yID0gdmFsdWU7XG4gICAgICB0aGlzLnJlc3VsdHMuZXJyb3IgPSB0cnVlO1xuICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgIH1cblxuICAgdGhpcy5yZWZyZXNoKCk7XG59O1xuXG4vL25vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbi8qKlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZhaWxlZE9ubHk9ZmFsc2VdXG4gKiBAcmV0dXJucyB7VGVzdFVuaXR9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5jb25zb2xlID0gZnVuY3Rpb24gY29uc29sZShmYWlsZWRPbmx5KSB7XG5cbiAgIHZhciAvKiogQHR5cGUge3N0cmluZ30gICovbG9nVGV4dCwgLyoqIEB0eXBlIHtudW1iZXJ9ICAqL3MsIC8qKiBAdHlwZSB7bnVtYmVyfSAgKi9zdWNjZXNzZXMsIC8qKiBAdHlwZSB7bnVtYmVyfSAgKi90b3RhbDtcblxuICAgZmFpbGVkT25seSA9IHVuZGVmaW5lZCA/IGZhbHNlIDogZmFpbGVkT25seTtcblxuICAgc3VjY2Vzc2VzID0gdGhpcy5jb3VudFN1Y2Nlc3NmdWxUZXN0cygpO1xuICAgdG90YWwgPSB0aGlzLmNvdW50VG90YWxUZXN0cygpO1xuXG4gICBsb2dUZXh0ID0gKHRoaXMuZ2V0VGl0bGUoKSAhPT0gdW5kZWZpbmVkID8gdGhpcy5nZXRUaXRsZSgpICsgJyA6ICcgOiAnJykgKyAoc3VjY2Vzc2VzID09PSB0b3RhbCA/ICdzdWNjZXNzJyA6ICdmYWlsJyk7XG5cbiAgIGlmICh0b3RhbCA+IDEpIHtcbiAgICAgIGxvZ1RleHQgKz0gJyAtICcgKyBzdWNjZXNzZXMgKyAnLycgKyB0b3RhbDtcbiAgICAgIF9jb21tb24ubm9uU3RyaWN0RnVuY3Rpb24uZ3JvdXBDb2xsYXBzZWQobG9nVGV4dCk7XG5cbiAgICAgIGlmICh0aGlzLnNlY3Rpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgIGZvciAocyBpbiB0aGlzLnNlY3Rpb25zKSB7XG5cbiAgICAgICAgICAgIGlmIChmYWlsZWRPbmx5KSBpZiAodGhpcy5zZWN0aW9uc1tzXS5pc1N1Y2Nlc3NmdWwoKSkgY29udGludWU7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25zW3NdLmNvdW50VG90YWxUZXN0cygpID09PSAwKSBjb250aW51ZTtcblxuICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1tzXS5jb25zb2xlKGZhaWxlZE9ubHkpO1xuICAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgZm9yIChzIGluIHRlc3RzKSB7XG4gICAgICAgICAgICBpZiAoZmFpbGVkT25seSkgaWYgKHRlc3RzW3NdLmlzU3VjY2Vzc2Z1bCgpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgdGhpcy5zZWN0aW9uc1swXS50ZXN0c1tzXS5jb25zb2xlKCk7XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9jb21tb24ubm9uU3RyaWN0RnVuY3Rpb24uZ3JvdXBFbmQoKTtcbiAgIH0gZWxzZSB7XG5cbiAgICAgIGlmICh0aGlzLmlzU3VjY2Vzc2Z1bCgpKSBfY29tbW9uLm5vblN0cmljdEZ1bmN0aW9uLmxvZyhsb2dUZXh0KTtlbHNlIF9jb21tb24ubm9uU3RyaWN0RnVuY3Rpb24ud2Fybihsb2dUZXh0KTtcbiAgIH1cblxuICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuY291bnRFcnJvcnMgPSBmdW5jdGlvbiBjb3VudEVycm9yKCkge1xuICAgcmV0dXJuIHRoaXMucmVzdWx0cy5jb3VudC5lcnJvcnM7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuY291bnRGYWlsZWRUZXN0cyA9IGZ1bmN0aW9uIGNvdW50RmFpbGVkVGVzdHMoKSB7XG4gICByZXR1cm4gdGhpcy5yZXN1bHRzLmNvdW50LmZhaWxzO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge251bWJlcn1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmNvdW50U3VjY2Vzc2Z1bFRlc3RzID0gZnVuY3Rpb24gY291bnRTdWNjZXNzZnVsVGVzdHMoKSB7XG4gICByZXR1cm4gdGhpcy5yZXN1bHRzLmNvdW50LnN1Y2Nlc3Nlcztcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5jb3VudFRvdGFsVGVzdHMgPSBmdW5jdGlvbiBjb3VudFRvdGFsVGVzdHMoKSB7XG4gICByZXR1cm4gdGhpcy5yZXN1bHRzLmNvdW50LnRvdGFsO1xufTtcblxuLyoqXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgKi9cblRlc3RVbml0LnByb3RvdHlwZS5kZXNjcmliZSA9IGZ1bmN0aW9uIGRlc2NyaWJlKGRlc2NyaXB0aW9uKSB7XG4gICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICByZXR1cm4gdGhpcy5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiBleGVjdXRlZCB0byBpbmRpY2F0ZSB0aGF0IHRoZSBhc3luYyBmdW5jdGlvbiBoYXMgZmluaXNoZWQuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHJlbGV2YW50IG9ubHkgaWYgdGhlIGFzeW5jIGNhbGwgaGFzIGJlZW4gbWFkZSBieSBwcm92aWRpbmcgYSB0aW1lb3V0LlxuICogSWYgc28sIHRoZW4gYSB0ZXN0IHdpbGwgYmUgZG9uZSA6IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHN0YXJ0IG9mIHRoZSB0ZXN0IGZ1bmN0aW9uIGFuZCB0aGUgZXhlY3V0aW9uIG9mIHRoZSBkb25lIGZ1bmN0aW9uXG4gKiBtdXN0IGJlIGxlc3NlciB0aGFuIHRoZSB0aW1lb3V0IHByb3ZpZGVkIGluaXRpYWxseS5cbiAqXG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gZG9uZSgpIHtcbiAgIHRoaXMudGVzdEV4ZWN1dGlvbi5kb25lKCk7XG4gICByZXR1cm4gdGhpcy5nZXRQcm9taXNlKCk7XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgdGhlIHVuaXQgdGVzdFxuICogVE9ETyA6IFRoaXMgZnVuY3Rpb24gY291bGQgYnkgc2ltcGxpZnlcbiAqXG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgIHZhciAvKiogQHR5cGUge2Z1bmN0aW9ufSAqL2Z1bGxmaWxsRnVuY3Rpb24sIC8qKiBAdHlwZSB7UHJvbWlzZX0gICovcHJvbWlzZSwgLyoqIEB0eXBlIHtmdW5jdGlvbn0gKi9yZWplY3RGdW5jdGlvbiwgLyoqIEB0eXBlIHtmdW5jdGlvbn0gKi90aGVuRnVuY3Rpb247XG5cbiAgIGlmICghdGhpcy5lbmFibGVkKSByZXR1cm47XG5cbiAgIGlmICh0aGlzLmFzeW5jIHx8IHRoaXMudmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG5cbiAgICAgIC8vIFRoZSB2YWx1ZSBpcyBhIHByb21pc2VcbiAgICAgIGlmICh0aGlzLnZhbHVlLiQgaW5zdGFuY2VvZiBUZXN0VW5pdCkge1xuXG4gICAgICAgICB0aGVuRnVuY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS4kLmdldFJlc3VsdCgpO1xuICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICBwcm9taXNlID0gdGhpcy52YWx1ZS4kLnByb21pc2VUaGVuRnVuY3Rpb24odGhlbkZ1bmN0aW9uLCB0aGVuRnVuY3Rpb24pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgcHJvbWlzZSA9IHRoaXMudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIC8vIFRlc3QgdXNpbmcgdGhlIFwiZGVsYXlcIiBmdW5jdGlvblxuICAgICAgZWxzZSBpZiAodGhpcy5leGVjdXRpb25EZWxheSAhPT0gZmFsc2UpIHtcblxuICAgICAgICAgICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChmdWxsZmlsbCwgcmVqZWN0KSB7XG4gICAgICAgICAgICAgICBmdWxsZmlsbEZ1bmN0aW9uID0gZnVsbGZpbGw7XG4gICAgICAgICAgICAgICByZWplY3RGdW5jdGlvbiA9IHJlamVjdDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBmdWxsZmlsbEZ1bmN0aW9uKHRoaXMudGVzdEV4ZWN1dGlvbi5leGVjdXRlKHRoaXMudmFsdWUpKTtcbiAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgcmVqZWN0RnVuY3Rpb24oZXJyKTtcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgdGhpcy5leGVjdXRpb25EZWxheSk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIFN0YW5kYXJkIFwiYXN5bmNcIiBjYWxsXG4gICAgICAgICBlbHNlIGlmICh0aGlzLnByb21pc2VSb2xlID09PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudGVzdEV4ZWN1dGlvbi5leGVjdXRlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGVzdCBjYWxsIGJ5IGEgXCJ0aGVuXCIgZnVuY3Rpb25cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMucHJvbWlzZVJvbGUgPT09ICd0aGVuJykgcHJvbWlzZSA9IHRoaXMucGFyZW50LnByb21pc2VUaGVuRnVuY3Rpb24oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0RXhlY3V0aW9uLmV4ZWN1dGUodmFsdWUpO1xuICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgICAgLy8gVGVzdCBjYWxsIGJ5IGEgXCJjYXRjaFwiIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICBlbHNlIHByb21pc2UgPSB0aGlzLnBhcmVudC5wcm9taXNlVGhlbkZ1bmN0aW9uKHVuZGVmaW5lZCwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0RXhlY3V0aW9uLmV4ZWN1dGUoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgIH0gZWxzZSBpZiAodGhpcy50ZXN0RnVuY3Rpb24pIHtcbiAgICAgIHRoaXMudmFsdWUgPSB0aGlzLnRlc3RFeGVjdXRpb24uZXhlY3V0ZSgpO1xuXG4gICAgICBpZiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIFByb21pc2UpIHByb21pc2UgPSB0aGlzLnZhbHVlO1xuICAgfVxuXG4gICBpZiAocHJvbWlzZSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIGlmIChwcm9taXNlLiQgaW5zdGFuY2VvZiBUZXN0VW5pdCkge1xuICAgICAgICAgcHJvbWlzZS4kLnByb21pc2VUaGVuRnVuY3Rpb24oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlKGZhbHNlLCB2YWx1ZSk7XG4gICAgICAgICB9LmJpbmQodGhpcyksIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgdGhpcy5jb21wbGV0ZSh0cnVlLCBlcnJvcik7XG4gICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuY29tcGxldGUoZmFsc2UsIHZhbHVlKTtcbiAgICAgICAgIH0uYmluZCh0aGlzKSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLmNvbXBsZXRlKHRydWUsIGVycm9yKTtcbiAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICB9XG4gICB9IGVsc2UgdGhpcy5jb21wbGV0ZShmYWxzZSwgdGhpcy52YWx1ZSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXRDb21tZW50cyA9IGZ1bmN0aW9uIGdldENvbW1lbnRzKCkge1xuICAgcmV0dXJuIHRoaXMuY29tbWVudHMuc2xpY2UoMCk7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgcHJvbWlzZSB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgb25jZSBhbGwgdGhlIHRlc3QgYW5kIHN1Yi10ZXN0cyAoaW5jbHVkaW5nIHByb21pc2VzIHRlc3RzKSBhcmUgZmluaXNoZWRcbiAqXG4gKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldENvbXBsZXRlZFByb21pc2UgPSBmdW5jdGlvbiBnZXRDb21wbGV0ZWRQcm9taXNlKCkge1xuXG4gICB2YXIgLyoqIEB0eXBlIHtudW1iZXJ9ICAgICovaSwgLyoqIEB0eXBlIHtQcm9taXNlW119ICovcHJvbWlzZXM7XG5cbiAgIHByb21pc2VzID0gW3RoaXMuZ2V0UHJvbWlzZSgpXTtcblxuICAgZm9yIChpIGluIHRoaXMuc2VjdGlvbnMpIHtcbiAgICAgIHByb21pc2VzLnB1c2godGhpcy5zZWN0aW9uc1tpXS5nZXRDb21wbGV0ZWRQcm9taXNlKCkpO1xuICAgfVxuXG4gICBmb3IgKGkgaW4gdGhpcy5uZXh0cykge1xuICAgICAgcHJvbWlzZXMucHVzaCh0aGlzLm5leHRzW2ldLmdldENvbXBsZXRlZFByb21pc2UoKSk7XG4gICB9XG5cbiAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZhaWxlZE9ubHk9ZmFsc2VdXG4gKiBAcmV0dXJucyB7VGVzdFVuaXRFeHBvcnR9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gZ2V0RGF0YShmYWlsZWRPbmx5KSB7XG5cbiAgIHZhciAvKiogQHR5cGUge09iamVjdH0gICAgICAgICAgICovZGF0YSwgLyoqIEB0eXBlIHtudW1iZXJ9ICAgICAgICAgICAqL24sIC8qKiBAdHlwZSB7VGVzdFVuaXRFeHBvcnRbXX0gKi9uZXh0cywgLyoqIEB0eXBlIHtudW1iZXJ9ICAgICAgICAgICAqL3M7XG5cbiAgIG5leHRzID0gW107XG5cbiAgIGZhaWxlZE9ubHkgPSBmYWlsZWRPbmx5ID09PSB1bmRlZmluZWQgPyBmYWxzZSA6IGZhaWxlZE9ubHk7XG5cbiAgIGZvciAobiBpbiB0aGlzLm5leHRzKSB7XG5cbiAgICAgIGlmIChmYWlsZWRPbmx5KSBpZiAodGhpcy5uZXh0c1tuXS5pc1N1Y2Nlc3NmdWwoKSkgY29udGludWU7XG5cbiAgICAgIG5leHRzLnB1c2godGhpcy5uZXh0c1tuXS5nZXREYXRhKGZhaWxlZE9ubHkpKTtcbiAgIH1cblxuICAgZGF0YSA9IHsgYXN5bmM6IHRoaXMuYXN5bmMsXG4gICAgICBlbmFibGVkOiB0aGlzLmVuYWJsZWQsXG4gICAgICBpZDogdGhpcy5pZCxcbiAgICAgIG5leHRzOiBuZXh0cyxcbiAgICAgIG5vdDogdGhpcy5ub3RNb2RlLFxuICAgICAgcmVzdWx0OiB0aGlzLnJlc3VsdHMudGVzdCxcbiAgICAgIHNlY3Rpb25zOiBbXSxcbiAgICAgIHN0cmljdDogdGhpcy5zdHJpY3RNb2RlLFxuICAgICAgdGVzdFBhcmFtZXRlcnM6IHRoaXMudGVzdFBhcmFtZXRlcnNFeHBvcnQsXG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIHR5cGU6ICdUZXN0VW5pdCcsXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZVxuICAgfTtcblxuICAgZm9yIChzIGluIHRoaXMuc2VjdGlvbnMpIHtcblxuICAgICAgaWYgKGZhaWxlZE9ubHkpIGlmICh0aGlzLnNlY3Rpb25zW3NdLmlzU3VjY2Vzc2Z1bCgpKSBjb250aW51ZTtcblxuICAgICAgLy8gSWYgdGhlIGZpcnN0IHNlY3Rpb24gaXMgZW1wdHksIHdlIHNraXAgaXRcbiAgICAgIGlmIChzID09IDAgJiYgdGhpcy5zZWN0aW9uc1tzXS5jb3VudFRvdGFsVGVzdHMoKSA9PT0gMCkgY29udGludWU7XG5cbiAgICAgIGRhdGEuc2VjdGlvbnMucHVzaCh0aGlzLnNlY3Rpb25zW3NdLmdldERhdGEoZmFpbGVkT25seSkpO1xuICAgfVxuXG4gICBpZiAodGhpcy50ZXN0VHlwZSkgZGF0YVsndGVzdCddID0gdGhpcy50ZXN0VHlwZS5jb2RlO1xuXG4gICByZXR1cm4gZGF0YTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXREZXNjcmlwdGlvbiA9IGZ1bmN0aW9uIGdldERlc2NyaXB0aW9uKCkge1xuICAgcmV0dXJuIHRoaXMuZGVzY3JpcHRpb247XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldER1cmF0aW9uUmVzdWx0ID0gZnVuY3Rpb24gZ2V0RHVyYXRpb25SZXN1bHQoKSB7XG4gICByZXR1cm4gdGhpcy5kdXJhdGlvblJlc3VsdDtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtET01UZXN0fVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuZ2V0RE9NID0gZnVuY3Rpb24gZ2V0RE9NKCkge1xuICAgcmV0dXJuIHRoaXMuZG9tVGVzdDtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtEYXRlfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuZ2V0RW5kRGF0ZSA9IGZ1bmN0aW9uIGdldEVuZERhdGUoKSB7XG4gICBpZiAodGhpcy50ZXN0RnVuY3Rpb24pIHJldHVybiB0aGlzLnRlc3RFeGVjdXRpb24uZ2V0RW5kRGF0ZSgpO1xuXG4gICByZXR1cm4gdGhpcy5jcmVhdGlvbkRhdGU7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7bnVtYmVyfHVuZGVmaW5lZH1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldEVuZFRpbWUgPSBmdW5jdGlvbiBnZXRFbmRUaW1lKCkge1xuICAgdGhpcy5nZXRQcm9qZWN0KCkuZ2V0VGltZSh0aGlzLmdldEVuZERhdGUoKSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7VGVzdFByb21pc2V9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXRQcm9taXNlID0gZnVuY3Rpb24gZ2V0UHJvbWlzZSgpIHtcbiAgIHJldHVybiB0aGlzLnByb21pc2U7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7UHJvamVjdH1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldFByb2plY3QgPSBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgcmV0dXJuIHRoaXMucHJvamVjdDtcbn07XG5cbi8vbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xuLyoqXG4gKlxuICogQHJldHVybnMge1Rlc3RVbml0W119XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXROZXh0cyA9IGZ1bmN0aW9uIGdldE5leHRzKCkge1xuICAgcmV0dXJuIHRoaXMubmV4dHMuc2xpY2UoMCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbGwgbm90ZXMgb2YgdGhlIHRlc3RcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldE5vdGVzID0gZnVuY3Rpb24gZ2V0Tm90ZXMoKSB7XG4gICByZXR1cm4gdGhpcy5ub3Rlcy5zbGljZSgwKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIHRlc3QuXG4gKiBEbyBub3QgdGFrZSBjYXJlIG9mIHRoZSB0aW1lb3V0IG9mIHRoZSBmdW5jdGlvbiBub3IgdGhlIGNoaWxkIHRlc3RzXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXRSZXN1bHQgPSBmdW5jdGlvbiBnZXRSZXN1bHQoKSB7XG4gICBpZiAodGhpcy5yZXN1bHRzLnRlc3QgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgIGlmICh0aGlzLnJlc3VsdHMuY291bnQuZmFpbHMgPiAwKSByZXR1cm4gZmFsc2U7XG5cbiAgIGlmICh0aGlzLnJlc3VsdHMudmFsaWRpdHkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgIHJldHVybiB0aGlzLnJlc3VsdHMudGltZW91dCAhPT0gZmFsc2U7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7U2VjdGlvbltdfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuZ2V0U2VjdGlvbnMgPSBmdW5jdGlvbiBnZXRTZWN0aW9ucygpIHtcbiAgIHJldHVybiB0aGlzLnNlY3Rpb25zLnNsaWNlKDApO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge0RhdGV9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXRTdGFydERhdGUgPSBmdW5jdGlvbiBnZXRTdGFydERhdGUoKSB7XG4gICBpZiAodGhpcy50ZXN0RnVuY3Rpb24pIHJldHVybiB0aGlzLnRlc3RFeGVjdXRpb24uZ2V0U3RhcnREYXRlKCk7XG5cbiAgIHJldHVybiB0aGlzLmNyZWF0aW9uRGF0ZTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtudW1iZXJ8dW5kZWZpbmVkfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuZ2V0U3RhcnRUaW1lID0gZnVuY3Rpb24gZ2V0U3RhcnRUaW1lKCkge1xuICAgcmV0dXJuIHRoaXMuZ2V0UHJvamVjdCgpLmdldFRpbWUodGhpcy5nZXRTdGFydERhdGUoKSk7XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5nZXRUZXN0RnVuY3Rpb24gPSBmdW5jdGlvbiBnZXRUZXN0RnVuY3Rpb24oKSB7XG4gICByZXR1cm4gdGhpcy50ZXN0RnVuY3Rpb247XG59O1xuXG4vKipcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nfHVuZGVmaW5lZH1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldFRpdGxlID0gZnVuY3Rpb24gZ2V0VGl0bGUoKSB7XG4gICByZXR1cm4gdGhpcy50aXRsZTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHtBcnJheS48c3RyaW5nPn1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmdldFRvRG9MaXN0ID0gZnVuY3Rpb24gZ2V0VG9Eb0xpc3QoKSB7XG4gICByZXR1cm4gdGhpcy50b0RvTGlzdC5zbGljZSgwKTtcbn07XG5cbi8qKlxuICpcbiAqIEByZXR1cm5zIHsqfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuZ2V0VmFsdWUgPSBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgIHJldHVybiB0aGlzLnZhbHVlO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5oYXNBc3luY1Rlc3RzID0gZnVuY3Rpb24gaGFzQXN5bmNUZXN0cygpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL24sIC8qKiBAdHlwZSB7bnVtYmVyfSAqL3M7XG5cbiAgIGlmICh0aGlzLmFzeW5jVGVzdHMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuYXN5bmNUZXN0cztcblxuICAgaWYgKHRoaXMuYXN5bmMpIHtcbiAgICAgIHRoaXMuYXN5bmNUZXN0cyA9IHRydWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgIH1cblxuICAgZm9yIChuIGluIHRoaXMubmV4dHMpIHtcbiAgICAgIGlmICh0aGlzLm5leHRzW25dLmhhc0FzeW5jVGVzdHMoKSkge1xuICAgICAgICAgdGhpcy5hc3luY1Rlc3RzID0gdHJ1ZTtcbiAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgfVxuXG4gICBmb3IgKHMgaW4gdGhpcy5zZWN0aW9ucykge1xuICAgICAgaWYgKHRoaXMuc2VjdGlvbnNbc10uaGFzQXN5bmNUZXN0cygpKSB7XG4gICAgICAgICB0aGlzLmFzeW5jVGVzdHMgPSB0cnVlO1xuICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICB9XG5cbiAgIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHRlc3QgYXMgZmluaXNoZWQuIEZhbHNlIG90aGVyd2lzZVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuaGFzRmluaXNoZWQgPSBmdW5jdGlvbiBoYXNGaW5pc2hlZCgpIHtcblxuICAgdmFyIC8qKiBAdHlwZSB7bnVtYmVyfSAqL24sIC8qKiBAdHlwZSB7bnVtYmVyfSAqL3M7XG5cbiAgIGlmICh0aGlzLl9oYXNGaW5pc2hlZCA9PT0gdHJ1ZSkgcmV0dXJuIHRoaXMuX2hhc0ZpbmlzaGVkO1xuXG4gICBpZiAodGhpcy50ZXN0RnVuY3Rpb24pIHtcbiAgICAgIGlmICghdGhpcy50ZXN0RXhlY3V0aW9uLmhhc0ZpbmlzaGVkKCkpIHJldHVybiBmYWxzZTtcbiAgIH1cblxuICAgZm9yIChzIGluIHRoaXMuc2VjdGlvbnMpIHtcbiAgICAgIGlmICghdGhpcy5zZWN0aW9uc1tzXS5oYXNGaW5pc2hlZCgpKSByZXR1cm4gZmFsc2U7XG4gICB9XG5cbiAgIGZvciAobiBpbiB0aGlzLm5leHRzKSB7XG4gICAgICBpZiAoIXRoaXMubmV4dHNbbl0uaGFzRmluaXNoZWQoKSkgcmV0dXJuIGZhbHNlO1xuICAgfVxuXG4gICB0aGlzLl9oYXNGaW5pc2hlZCA9IHRydWU7XG4gICByZXR1cm4gdGhpcy5faGFzRmluaXNoZWQ7XG59O1xuXG4vKipcbiAqIEluZGljYXRlIGlmIHRoZSB0ZXN0IGZ1bmN0aW9uIGhhcyBmaW5pc2hlZCBpbiB0aW1lLlxuICogSWYgdGhlcmUgaXMgbm8gdGVzdCBmdW5jdGlvbiB0aGVuIHJldHVybiB0cnVlLlxuICogSWYgdGhlcmUgaXMgbm8gdGltZW91dCBkZWZpbmVkLCB0aGVuIHJldHVybiB0cnVlLlxuICogSWYgdGhlIGZ1bmN0aW9uIGhhc24ndCBmaW5pc2hlZCB5ZXQgYnV0IGhhcyByZWFjaGVkIHRoZSB0aW1lb3V0LCB0aGVuIHJldHVybiBmYWxzZS5cbiAqIElmIHRoZSBmdW5jdGlvbiBoYXNuJ3QgZmluaXNoZWQgYnV0IGl0J3Mgc3RpbGwgcmVzcGVjdGluZyB0aGUgdGltZW91dCwgdGhlbiByZXR1cm4gdW5kZWZpbmVkXG4gKiBAcmV0dXJucyB7Ym9vbGVhbnx1bmRlZmluZWR9XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5oYXNGaW5pc2hlZEluVGltZSA9IGZ1bmN0aW9uIGhhc0ZpbmlzaGVkSW5UaW1lKCkge1xuXG4gICBpZiAoIXRoaXMudGVzdEZ1bmN0aW9uKSByZXR1cm4gdHJ1ZTtcblxuICAgaWYgKHRoaXMudGltZW91dCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcblxuICAgaWYgKHRoaXMudGVzdEV4ZWN1dGlvbi5oYXNGaW5pc2hlZCgpKSByZXR1cm4gdGhpcy50ZXN0RXhlY3V0aW9uLmdldER1cmF0aW9uKCkgPCB0aGlzLnRpbWVvdXQ7XG5cbiAgIHJldHVybiB0aGlzLnRlc3RFeGVjdXRpb24uZ2V0RHVyYXRpb24odHJ1ZSkgPj0gdGhpcy50aW1lb3V0ID8gZmFsc2UgOiB1bmRlZmluZWQ7XG59O1xuXG4vKipcbiAqIEluZGljYXRlIGlmIHRoZSB0ZXN0IGlzIGNsb3NlZCAodHJ1ZSkgb3Igbm90IChmYWxzZSkuXG4gKiBBIHRlc3QgaXMgY2xvc2VkIGlmIGl0IGhhcyBmaW5pc2hlZCBvciBhcyByZWFjaGVkIHRoZSB0aW1lb3V0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLmlzQ2xvc2VkID0gZnVuY3Rpb24gaXNDbG9zZWQoKSB7XG4gICBpZiAodGhpcy5faXNDbG9zZWQgPT09IHRydWUpIHJldHVybiB0cnVlO1xuXG4gICBpZiAodGhpcy5oYXNGaW5pc2hlZCgpKSB7XG4gICAgICB0aGlzLl9pc0Nsb3NlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgIH1cblxuICAgaWYgKHRoaXMuaGFzRmluaXNoZWRJblRpbWUoKSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2lzQ2xvc2VkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgfVxufTtcblxuVGVzdFVuaXQucHJvdG90eXBlLmlzR3JvdXAgPSBmdW5jdGlvbiBpc0dyb3VwKCkge1xuICAgaWYgKHRoaXMuc2VjdGlvbnMubGVuZ3RoID4gMSkgcmV0dXJuIHRydWU7XG5cbiAgIGlmICh0aGlzLm5leHRzLmxlbmd0aCA+IDApIHJldHVybiB0cnVlO1xuXG4gICByZXR1cm4gdGhpcy5zZWN0aW9uc1swXS5nZXRUZXN0cygpLmxlbmd0aCA+IDA7XG59O1xuXG4vKipcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUuaXNTdWNjZXNzZnVsID0gZnVuY3Rpb24gaXNTdWNjZXNzZnVsKCkge1xuXG4gICB2YXIgLyoqIEB0eXBlIHtudW1iZXJ9ICovcywgLyoqIEB0eXBlIHtudW1iZXJ9ICovdDtcblxuICAgaWYgKHRoaXMuZ2V0UmVzdWx0KCkgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgIGZvciAocyBpbiB0aGlzLnNlY3Rpb25zKSB7XG4gICAgICBpZiAoIXRoaXMuc2VjdGlvbnNbc10uaXNTdWNjZXNzZnVsKCkpIHJldHVybiBmYWxzZTtcbiAgIH1cblxuICAgZm9yICh0IGluIHRoaXMubmV4dHMpIHtcbiAgICAgIGlmICghdGhpcy5uZXh0c1t0XS5pc1N1Y2Nlc3NmdWwoKSkgcmV0dXJuIGZhbHNlO1xuICAgfVxuXG4gICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmV0dXJuIHRydWUgaWYgdGhlIHRlc3QgaXMgYSB1bml0IHRlc3QsIGZhbHNlIG90aGVyd2lzZS5cbiAqIFRoZSB0ZXN0IGlzIGFuIHVuaXQgdGVzdCBpZiBhIHRlc3QgdHlwZSBoYXMgYmVlbiBkZWZpbmVkIChleDogaXNUcnVlKVxuICogb3IgaWYgYSB0ZXN0IGZ1bmN0aW9uIGFzIGJlZW4gZGVmaW5lZCBhbiBpZiB0aGlzIGZ1bmN0aW9uIHJldHVybmVkIGEgdmFsdWUgKHRoYXQgaXMgbm90IGEgcHJvbWlzZSkuXG4gKiBOb3RlIHRoYXQgaWYgYSB0aW1lb3V0IGhhcyBiZWVuIGRlZmluZWQsIHRoZW4gaXQncyBhIHRlc3QgdW5pdFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5pc1VuaXRUZXN0ID0gZnVuY3Rpb24gaXNVbml0VGVzdCgpIHtcblxuICAgLy8gSWYgdGhlcmUgaXMgbm8gdGVzdCBmdW5jdGlvbiwgdGhlbiBpdCdzIHRoYXQgYSB2YWx1ZSBoYXMgYmVlbiBwcm92aWRlZFxuICAgLy9ub2luc3BlY3Rpb24gSlNWYWxpZGF0ZVR5cGVzXG4gICBpZiAodGhpcy50ZXN0RnVuY3Rpb24gPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWU7XG5cbiAgIGlmICh0aGlzLnRlc3RUeXBlICE9PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuXG4gICBpZiAodGhpcy50aW1lb3V0ICE9PSB1bmRlZmluZWQpIHJldHVybiB0cnVlO1xuXG4gICAvL25vaW5zcGVjdGlvbiBSZWR1bmRhbnRDb25kaXRpb25hbEV4cHJlc3Npb25KU1xuICAgcmV0dXJuIHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhKHRoaXMudmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlIHx8IHRoaXMudmFsdWUgaW5zdGFuY2VvZiBUZXN0VW5pdCkgPyB0cnVlIDogZmFsc2U7XG59O1xuXG4vKipcbiAqIEluZGljYXRlIGlmIHRoZSB0ZXN0IGlzIHZhIHZhbGlkIHRlc3Qgb3Igbm90LlxuICogQSB0ZXN0IGlzIGludmFsaWQgaWYgaXQncyBub3QgYSB1bml0IHRlc3QgYW5kIGlmIGl0IGRpZG4ndCBkZWZpbmVkIGFueSBvdGhlciB0ZXN0L3NlY3Rpb25zIChubyBjaGlsZCB0ZXN0cywgbm8gcHJvbWlzZXMgdGVzdHMpXG4gKlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5pc1ZhbGlkID0gZnVuY3Rpb24gaXNWYWxpZCgpIHtcblxuICAgaWYgKHRoaXMuaXNVbml0VGVzdCgpKSByZXR1cm4gdHJ1ZTtcblxuICAgcmV0dXJuIHRoaXMuaXNHcm91cCgpO1xufTtcblxuLyoqXG4gKiBJbnZlcnQgdGhlIHNlbnMgb2YgdGhlIHRlc3RcbiAqIEByZXR1cm5zIHtUZXN0UHJvbWlzZX1cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLm5vdCA9IGZ1bmN0aW9uIG5vdCgpIHtcbiAgIHRoaXMubm90TW9kZSA9IHRydWU7XG4gICByZXR1cm4gdGhpcy5nZXRQcm9taXNlKCk7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbm90ZVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUubm90ZSA9IGZ1bmN0aW9uIG5vdGUobm90ZSkge1xuICAgdGhpcy5ub3Rlcy5wdXNoKG5vdGUpO1xuICAgcmV0dXJuIHRoaXMuZ2V0UHJvbWlzZSgpO1xufTtcblxuLyoqXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGZhaWxzLCBzdWNjZXNzZXMgYW5kIHRvdGFsIHRlc3Rlcy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbZGVsdGFFcnJvcnNdXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlbHRhRmFpbHNdXG4gKiBAcGFyYW0ge251bWJlcn0gW2RlbHRhU3VjY2Vzc2VzXVxuICogQHBhcmFtIHtudW1iZXJ9IFtkZWx0YVRvdGFsXVxuICpcbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiByZWZyZXNoKGRlbHRhRXJyb3JzLCBkZWx0YUZhaWxzLCBkZWx0YVN1Y2Nlc3NlcywgZGVsdGFUb3RhbCkge1xuXG4gICB2YXIgLyoqIEB0eXBlIHsqfSAgICAgICAqL2Vycm9yLCAvKiogQHR5cGUge251bWJlcn0gICovZXJyb3JzLCAvKiogQHR5cGUge251bWJlcn0gICovZmFpbHMsIC8qKiBAdHlwZSB7Ym9vbGVhbn0gKi9oYXNGaW5pc2hlZEluVGltZSwgLyoqIEB0eXBlIHtudW1iZXJ9ICAqL3MsIC8qKiBAdHlwZSB7bnVtYmVyfSAgKi9zdWNjZXNzZXMsIC8qKiBAdHlwZSB7bnVtYmVyfSAgKi90LCAvKiogQHR5cGUge251bWJlcn0gICovdG90YWw7XG5cbiAgIGlmICh0aGlzLmNvbXBsZXRlZCAmJiAhdGhpcy5jYWxjdWxhdGVkKSB7XG5cbiAgICAgIGlmICh0aGlzLnJlc3VsdHMuZXJyb3IpIHtcbiAgICAgICAgIHRoaXMuY2FsY3VsYXRlZCA9IHRydWU7XG4gICAgICAgICB0aGlzLnJlamVjdFByb21pc2UodGhpcy5lcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5yZXN1bHRzLmVycm9yIHx8IHRoaXMuZXJyb3JFeHBlY3RlZCkge1xuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuY2FsY1Jlc3VsdCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJlc3VsdHMuZXJyb3IpIHRoaXMuZnVsbGZpbGxQcm9taXNlKHRoaXMudmFsdWUpO1xuICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgICAgIHRoaXMucmVzdWx0cy5lcnJvciA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnJlamVjdFByb21pc2UodGhpcy5lcnJvcik7XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9XG5cbiAgIC8vIFdlIHJlZnJlc2ggb25seSBpZiBjb3VudHMgaGF2ZSBhbHJlYWR5IGJlZW4gZG9uZVxuICAgaWYgKHRoaXMucmVzdWx0cy5jb3VudC50b3RhbCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgIGlmIChkZWx0YVRvdGFsICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXN1bHRzLmNvdW50LnRvdGFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5kZWx0YUVycm9ycyArPSBkZWx0YUVycm9ycztcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC5mYWlscyArPSBkZWx0YUZhaWxzO1xuICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LnN1Y2Nlc3NlcyArPSBkZWx0YVN1Y2Nlc3NlcztcbiAgICAgIHRoaXMucmVzdWx0cy5jb3VudC50b3RhbCArPSBkZWx0YVRvdGFsO1xuICAgICAgdGhpcy5yZXN1bHRzLmNvdW50LmlzVmFsaWQgPSB0aGlzLmlzVmFsaWQoKTtcbiAgIH0gZWxzZSB7XG5cbiAgICAgIHRoaXMuZXJyb3JzID0gW107XG5cbiAgICAgIC8vIENhbGN1bGF0aW5nIHZhbGlkaXR5IG9ubHkgaWYgdGhlIHRlc3Qgd2FzIHByZXZpb3VzbHkgaW52YWxpZFxuICAgICAgLy8gTm90ZSA6IGEgdmFsaWQgdGVzdCBjYW4ndCBiZWNvbWUgaW52YWxpZCAoYmVjYXVzZSBhIGludmFsaWQgdGVzdCBpcyBiYXNpY2FsbHkgYSB0ZXN0IHdpdGhvdXQgcmVzdWx0cyBub3Igc3ViIHRlc3RzKS5cbiAgICAgIGlmICghdGhpcy5yZXN1bHRzLnZhbGlkaXR5KSB0aGlzLnJlc3VsdHMudmFsaWRpdHkgPSB0aGlzLmlzVmFsaWQoKTtcblxuICAgICAgLy8gRXJyb3JzXG4gICAgICBlcnJvcnMgPSAwO1xuICAgICAgaWYgKHRoaXMucmVzdWx0cy5lcnJvciAmJiAhdGhpcy5lcnJvckV4cGVjdGVkKSB7XG4gICAgICAgICBlcnJvcnMgKz0gMTtcbiAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goJ1RoZSB0ZXN0IGhhcyByYWlzZWQgYW4gZXhjZXB0aW9uJyk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnJlc3VsdHMuZXJyb3IgJiYgdGhpcy5lcnJvckV4cGVjdGVkKSB7XG4gICAgICAgICBlcnJvcnMgKz0gMTtcbiAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goJ1RoZSB0ZXN0IHNob3VsZCBoYXZlIHJhaXNlIGFuIGV4Y2VwdGlvbicpO1xuICAgICAgfVxuXG4gICAgICAvLyBGYWlsc1xuICAgICAgZmFpbHMgPSB0aGlzLmlzVW5pdFRlc3QoKSAmJiAhdGhpcy5yZXN1bHRzLnRlc3QgPyAxIDogMDtcbiAgICAgIGZhaWxzICs9IGVycm9ycztcbiAgICAgIGZhaWxzICs9ICF0aGlzLnJlc3VsdHMudmFsaWRpdHkgPyAxIDogMDtcblxuICAgICAgaWYgKHRoaXMuaXNVbml0VGVzdCgpICYmICF0aGlzLnJlc3VsdHMudGVzdCkgdGhpcy5lcnJvcnMucHVzaCgnVGhlIHRlc3QgaGFzIGZhaWxlZCcpO1xuXG4gICAgICBpZiAoIXRoaXMucmVzdWx0cy52YWxpZGl0eSkgdGhpcy5lcnJvcnMucHVzaCgnTm90IGEgdmFsaWQgdGVzdCcpO1xuXG4gICAgICBoYXNGaW5pc2hlZEluVGltZSA9IHRoaXMuaGFzRmluaXNoZWRJblRpbWUoKTtcblxuICAgICAgaWYgKGhhc0ZpbmlzaGVkSW5UaW1lICE9PSB1bmRlZmluZWQgJiYgIWhhc0ZpbmlzaGVkSW5UaW1lKSBmYWlscyArPSAxO1xuXG4gICAgICAvLyBTdWNjZXNzZXNcbiAgICAgIHN1Y2Nlc3NlcyA9IHRoaXMuaXNVbml0VGVzdCgpICYmIHRoaXMucmVzdWx0cy50ZXN0ID8gMSA6IDA7XG4gICAgICBzdWNjZXNzZXMgKz0gdGhpcy50aW1lb3V0ICE9PSB1bmRlZmluZWQgJiYgdGhpcy5yZXN1bHRzLnRpbWVvdXQgPyAxIDogMDtcblxuICAgICAgaWYgKHRoaXMudGVzdEZ1bmN0aW9uICYmIHRoaXMudGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAvLyBOb3RlIDogaWYgdGhlIHRlc3QgaGFzbid0IGZpbmlzaGVkIGluIHRpbWUsIHRoZW4gd2UgaGF2ZSBhbm90aGVyIGZhaWxcbiAgICAgICAgIGhhc0ZpbmlzaGVkSW5UaW1lID0gdGhpcy5oYXNGaW5pc2hlZEluVGltZSgpO1xuXG4gICAgICAgICBpZiAoaGFzRmluaXNoZWRJblRpbWUgIT09IHVuZGVmaW5lZCAmJiAhaGFzRmluaXNoZWRJblRpbWUpIHN1Y2Nlc3NlcyArPSAxO1xuICAgICAgfVxuXG4gICAgICAvLyBUb3RhbFxuICAgICAgdG90YWwgPSB0aGlzLmlzVW5pdFRlc3QoKSA/IDEgOiAwO1xuICAgICAgdG90YWwgKz0gdGhpcy50aW1lb3V0ICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgIGZvciAocyBpbiB0aGlzLnNlY3Rpb25zKSB7XG4gICAgICAgICBlcnJvcnMgKz0gdGhpcy5zZWN0aW9uc1tzXS5jb3VudEVycm9ycygpO1xuICAgICAgICAgZmFpbHMgKz0gdGhpcy5zZWN0aW9uc1tzXS5jb3VudEZhaWxlZFRlc3RzKCk7XG4gICAgICAgICBzdWNjZXNzZXMgKz0gdGhpcy5zZWN0aW9uc1tzXS5jb3VudFN1Y2Nlc3NmdWxUZXN0cygpO1xuICAgICAgICAgdG90YWwgKz0gdGhpcy5zZWN0aW9uc1tzXS5jb3VudFRvdGFsVGVzdHMoKTtcbiAgICAgIH1cblxuICAgICAgZm9yICh0IGluIHRoaXMubmV4dHMpIHtcbiAgICAgICAgIGVycm9ycyArPSB0aGlzLm5leHRzW3NdLmNvdW50RXJyb3JzKCk7XG4gICAgICAgICBmYWlscyArPSB0aGlzLm5leHRzW3RdLmNvdW50RmFpbGVkVGVzdHMoKTtcbiAgICAgICAgIHN1Y2Nlc3NlcyArPSB0aGlzLm5leHRzW3RdLmNvdW50U3VjY2Vzc2Z1bFRlc3RzKCk7XG4gICAgICAgICB0b3RhbCArPSB0aGlzLm5leHRzW3RdLmNvdW50VG90YWxUZXN0cygpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5yZXN1bHRzLmNvdW50LnRvdGFsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIGRlbHRhRXJyb3JzID0gZXJyb3JzIC0gdGhpcy5yZXN1bHRzLmNvdW50LmVycm9ycztcbiAgICAgICAgIGRlbHRhRmFpbHMgPSBmYWlscyAtIHRoaXMucmVzdWx0cy5jb3VudC5mYWlscztcbiAgICAgICAgIGRlbHRhU3VjY2Vzc2VzID0gc3VjY2Vzc2VzIC0gdGhpcy5yZXN1bHRzLmNvdW50LnN1Y2Nlc3NlcztcbiAgICAgICAgIGRlbHRhVG90YWwgPSB0b3RhbCAtIHRoaXMucmVzdWx0cy5jb3VudC50b3RhbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXN1bHRzLmNvdW50ID0geyBlcnJvcnM6IGVycm9ycyxcbiAgICAgICAgIGZhaWxzOiBmYWlscyxcbiAgICAgICAgIHN1Y2Nlc3Nlczogc3VjY2Vzc2VzLFxuICAgICAgICAgdG90YWw6IHRvdGFsIH07XG4gICB9XG5cbiAgIGlmICh0aGlzLnBhcmVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodGhpcy5wYXJlbnQucmVzdWx0cy5jb3VudC50b3RhbCAhPT0gdW5kZWZpbmVkKSB0aGlzLnBhcmVudC5yZWZyZXNoKGRlbHRhRXJyb3JzLCBkZWx0YUZhaWxzLCBkZWx0YVN1Y2Nlc3NlcywgZGVsdGFUb3RhbCk7XG4gICB9XG5cbiAgIGlmICh0aGlzLmdldERPTSgpKSB0aGlzLmdldERPTSgpLnJlZnJlc2goKTtcbn07XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7RE9NVGVzdH0gZG9tXG4gKi9cblRlc3RVbml0LnByb3RvdHlwZS5zZXRET00gPSBmdW5jdGlvbiBzZXRET00oZG9tKSB7XG4gICB0aGlzLmRvbVRlc3QgPSBkb207XG59O1xuXG4vKipcbiAqXG4gKiBGdW5jdGlvbiB0byBleGVjdXRlIGFmdGVyIHRoZSB0ZXN0LlxuICpcbiAqIElmIHRoZSBmaXJzdCBwYXJhbWV0ZXIgaXMgYSBzdHJpbmcsIHRoZW4gYSBuZXcgdGVzdCB3aWxsIGJlIGNyZWF0ZWQgd2l0aCB0aGUgc3RyaW5nXG4gKiBhcyB0aXRsZSBhbmQgdGhlIHNlY29uZCBwYXJhbWV0ZXIgYXMgdGhlIHRlc3QuIEluIHRoaXMgY2FzZSwgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuXG4gKiB0aGUgbmV3bHkgY3JlYXRlZCB0ZXN0IHVuaXRcbiAqIE5vdGUgdGhhdCBpbiB0aGlzIGNhc2UsIGlmIHdlIGFyZSBhbiBzeW5jIHRlc3QsIHRoZSBcInRoZW5cIiB0ZXN0IHdpbGwgYmUgZXhlY3V0ZWQgc3luY2hyb25vdXNseS5cbiAqXG4gKiBJZiB0aGUgZmlyc3QgcGFyYW1ldGVyIGlzbid0IGEgc3RyaW5nLCB0aGVuIHRoZSBzdGFuZGFyZCBcInRoZW5cIiBmdW5jdGlvbiBvZiBwcm9taXNlIHBhdHRlcm5cbiAqIHdpbGwgYmUgY2FsbGVkLiBUaGUgZnVuY3Rpb24gd2lsbCByZXR1cm4gdGhlIG5ld2x5IGNyZWF0ZWQgcHJvbWlzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ3xmdW5jdGlvbn0gcGFyYW0xXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSAgICAgICAgW3BhcmFtMl1cbiAqIEBwYXJhbSB7ZnVuY3Rpb259ICAgICAgICBbcGFyYW0zXVxuICogQHJldHVybnMge1Rlc3RQcm9taXNlfVxuICovXG5UZXN0VW5pdC5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIHRoZW4ocGFyYW0xLCBwYXJhbTIsIHBhcmFtMykge1xuXG4gICB2YXIgLyoqIEB0eXBlIHtmdW5jdGlvbn0gKi9jYXRjaEZ1bmN0aW9uLCAvKiogQHR5cGUge1Rlc3RVbml0fSAqL2NhdGNoVGVzdCwgLyoqIEB0eXBlIHtmdW5jdGlvbn0gKi90aGVuRnVuY3Rpb24sIC8qKiBAdHlwZSB7VGVzdFVuaXR9ICovdGhlblRlc3QsIC8qKiBAdHlwZSB7c3RyaW5nfSAgICovdGl0bGU7XG5cbiAgIC8vIC50aGVuKGZjdCwgZmN0KTtcbiAgIC8vIC50aGVuKGZjdCk7XG4gICAvLyAudGhlbih1bmRlZmluZWQsIGZjdCk7XG4gICAvLyAudGhlbigndGVzdCcsIHVuZGVmaW5lZCwgZmN0KTtcbiAgIC8vIC50aGVuKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmY3QpO1xuXG4gICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGl0bGUgPSB1bmRlZmluZWQ7XG4gICAgICB0aGVuRnVuY3Rpb24gPSBwYXJhbTE7XG4gICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgICAgaWYgKHR5cGVvZiBwYXJhbTEgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICB0aXRsZSA9IHBhcmFtMTtcbiAgICAgICAgIHRoZW5GdW5jdGlvbiA9IHBhcmFtMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICB0aXRsZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgIHRoZW5GdW5jdGlvbiA9IHBhcmFtMTtcbiAgICAgICAgIGNhdGNoRnVuY3Rpb24gPSBwYXJhbTI7XG4gICAgICB9XG4gICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgIHRpdGxlID0gcGFyYW0xO1xuICAgICAgdGhlbkZ1bmN0aW9uID0gcGFyYW0yO1xuICAgICAgY2F0Y2hGdW5jdGlvbiA9IHBhcmFtMztcbiAgIH1cblxuICAgaWYgKHRoZW5GdW5jdGlvbiAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoZW5UZXN0ID0gbmV3IFRlc3RVbml0KHsgYXN5bmM6IHRydWUsXG4gICAgICAgICBjb250ZXh0OiB0aGlzLmNoaWxkQ29udGV4dCxcbiAgICAgICAgIGVuYWJsZWQ6IHRoaXMuZW5hYmxlZCxcbiAgICAgICAgIGV4ZWN1dGlvbkRlbGF5OiBmYWxzZSxcbiAgICAgICAgIHN0cmljdDogdGhpcy5zdHJpY3RNb2RlLFxuICAgICAgICAgcGFyZW50OiB0aGlzLFxuICAgICAgICAgcHJvamVjdDogdGhpcy5nZXRQcm9qZWN0KCksXG4gICAgICAgICBwcm9taXNlUm9sZTogJ3RoZW4nLFxuICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgdmFsdWU6IHRoZW5GdW5jdGlvbiB9KTtcblxuICAgICAgdGhpcy5uZXh0cy5wdXNoKHRoZW5UZXN0KTtcbiAgIH1cblxuICAgaWYgKGNhdGNoRnVuY3Rpb24gIT0gdW5kZWZpbmVkKSB7XG4gICAgICBjYXRjaFRlc3QgPSBuZXcgVGVzdFVuaXQoeyBhc3luYzogdHJ1ZSxcbiAgICAgICAgIGNvbnRleHQ6IHRoaXMuY2hpbGRDb250ZXh0LFxuICAgICAgICAgZW5hYmxlZDogdGhpcy5lbmFibGVkLFxuICAgICAgICAgZXhlY3V0aW9uRGVsYXk6IGZhbHNlLFxuICAgICAgICAgc3RyaWN0OiB0aGlzLnN0cmljdE1vZGUsXG4gICAgICAgICBwYXJlbnQ6IHRoaXMsXG4gICAgICAgICBwcm9qZWN0OiB0aGlzLmdldFByb2plY3QoKSxcbiAgICAgICAgIHByb21pc2VSb2xlOiAnY2F0Y2gnLFxuICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgdmFsdWU6IGNhdGNoRnVuY3Rpb24gfSk7XG5cbiAgICAgIHRoaXMuY2F0Y2hUZXN0cy5wdXNoKGNhdGNoVGVzdCk7XG4gICB9XG5cbiAgIHRoaXMucmVmcmVzaCgpO1xuXG4gICBpZiAodGhlblRlc3QgIT0gdW5kZWZpbmVkKSByZXR1cm4gdGhlblRlc3QuZ2V0UHJvbWlzZSgpO2Vsc2UgcmV0dXJuIGNhdGNoVGVzdC5nZXRQcm9taXNlKCk7XG59O1xuXG5UZXN0VW5pdC5wcm90b3R5cGUudG9kbyA9IGZ1bmN0aW9uIHRvZG8odGV4dCkge1xuICAgdGhpcy50b0RvTGlzdC5wdXNoKHRleHQpO1xuICAgcmV0dXJuIHRoaXMuZ2V0UHJvbWlzZSgpO1xufTtcblxuLyoqXG4gKlxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuVGVzdFVuaXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICByZXR1cm4gdGhpcy50aXRsZSArICcgOiAnICsgKHRoaXMuaXNTdWNjZXNzZnVsKCkgPyAnc3VjY2VzcycgOiAnZmFpbCcpICsgJyAoJyArIHRoaXMuY291bnRTdWNjZXNzZnVsVGVzdHMoKSArICcvJyArIHRoaXMuY291bnRUb3RhbFRlc3RzKCkgKyAnKSc7XG59O1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gaWRcbiAqIEByZXR1cm5zIHtUZXN0VW5pdH1cbiAqL1xuVGVzdFVuaXQuZ2V0ID0gZnVuY3Rpb24gKGlkKSB7XG4gICByZXR1cm4gVGVzdFVuaXQuQUxMW2lkXTtcbn07XG5cbi8qKlxuICogTGFzdCBJRCB1c2VkIGZvciBmb3IgYSB0ZXN0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICovXG5UZXN0VW5pdC5sYXN0SWQgPSAwO1xuXG4vKipcbiAqIExpc3Qgb2YgYWxsIHRlc3RzXG4gKiBAdHlwZSB7VGVzdFVuaXRbXX1cbiAqL1xuVGVzdFVuaXQuQUxMID0gW107XG5cblRlc3RVbml0LlRZUEVTID0geyB0ZXN0OiAndGVzdCcsXG4gICB1bml0OiAndW5pdCcgfTtcblxuLyoqXG4gKlxuICogQHR5cGUge09iamVjdC48VGVzdFR5cGU+fVxuICogQG5hbWVzcGFjZSBUZXN0VW5pdFxuICovXG5UZXN0VW5pdC5URVNUX1RZUEVTID0ge307XG5cbmV4cG9ydHMuZGVmYXVsdCA9IFRlc3RVbml0O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9VGVzdFVuaXQuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgTXVzdGFjaGUgPSByZXF1aXJlKCdtdXN0YWNoZScpO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gdmFsdWVcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjb3B5KHZhbHVlKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG59XG5cbi8qKlxuICpcbiAqIHRleHQgZnJvbSBodHRwOi8va3NibG9nLm9yZy9pbmRleC5waHA/cT1scGFkLXJwYWQtZnVuY3Rpb25zLWphdmFzY3JpcHQmaWQ9NDRcbiAqL1xuZnVuY3Rpb24gbHBhZChvcmlnaW5hbHN0ciwgbGVuZ3RoLCBzdHJUb1BhZCkge1xuICB3aGlsZSAob3JpZ2luYWxzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7XG4gICAgb3JpZ2luYWxzdHIgPSBzdHJUb1BhZCArIG9yaWdpbmFsc3RyO1xuICB9cmV0dXJuIG9yaWdpbmFsc3RyO1xufVxuXG5mdW5jdGlvbiByZW5kZXIyZG9tKHRlbXBsYXRlLCB2YWx1ZSkge1xuXG4gIHZhciAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqL2RpdiwgLyoqIEB0eXBlIHtzdHJpbmd9ICAgICAgKi9odG1sU3RyaW5nO1xuXG4gIGh0bWxTdHJpbmcgPSBNdXN0YWNoZS5yZW5kZXIodGVtcGxhdGUsIHZhbHVlKTtcblxuICBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGl2LmlubmVySFRNTCA9IGh0bWxTdHJpbmc7XG5cbiAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gdGltZVxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gdGltZTJzdHJpbmcodGltZSkge1xuXG4gIHZhciAvKiogQHR5cGUge3N0cmluZ30gKi90aW1lU3RyaW5nLCAvKiogQHR5cGUge251bWJlcn0gKi9ob3VycywgLyoqIEB0eXBlIHtudW1iZXJ9ICovbWludXRlcywgLyoqIEB0eXBlIHtudW1iZXJ9ICovc2Vjb25kcywgLyoqIEB0eXBlIHtudW1iZXJ9ICovbWlsbGlzZWNvbmRzO1xuXG4gIGlmICh0aW1lID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcblxuICBob3VycyA9IE1hdGguZmxvb3IodGltZSAvICg2MCAqIDYwICogMTAwMCkpO1xuICB0aW1lIC09IGhvdXJzICogNjAgKiA2MCAqIDEwMDA7XG5cbiAgbWludXRlcyA9IE1hdGguZmxvb3IodGltZSAvICg2MCAqIDEwMDApKTtcbiAgdGltZSAtPSBtaW51dGVzICogNjAgKiAxMDAwO1xuXG4gIHNlY29uZHMgPSBNYXRoLmZsb29yKHRpbWUgLyAxMDAwKTtcbiAgdGltZSAtPSBzZWNvbmRzICogMTAwMDtcblxuICBtaWxsaXNlY29uZHMgPSB0aW1lO1xuXG4gIHRpbWVTdHJpbmcgPSBob3VycyArICdoJyArIGxwYWQobWludXRlcywgMiwgJzAnKSArICdtJyArIGxwYWQobWlsbGlzZWNvbmRzLCA0LCAnMCcpO1xuXG4gIHJldHVybiB0aW1lU3RyaW5nO1xufVxuXG52YXIgbm9uU3RyaWN0RnVuY3Rpb24gPSB7IENvbnNvbGVfZ3JvdXBDb2xsYXBzZWQ6IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQsXG4gIENvbnNvbGVfZ3JvdXBFbmQ6IGNvbnNvbGUuZ3JvdXBFbmQsXG4gIENvbnNvbGVfd2FybjogY29uc29sZS53YXJuLFxuICBDb25zb2xlX2xvZzogY29uc29sZS5sb2cgfTtcblxubm9uU3RyaWN0RnVuY3Rpb24uZ3JvdXBDb2xsYXBzZWQgPSBmdW5jdGlvbiAoKSB7XG4gIG5vblN0cmljdEZ1bmN0aW9uLkNvbnNvbGVfZ3JvdXBDb2xsYXBzZWQuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbn07XG5cbm5vblN0cmljdEZ1bmN0aW9uLmdyb3VwRW5kID0gZnVuY3Rpb24gKCkge1xuICBub25TdHJpY3RGdW5jdGlvbi5Db25zb2xlX2dyb3VwRW5kLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59O1xuXG5ub25TdHJpY3RGdW5jdGlvbi53YXJuID0gZnVuY3Rpb24gKCkge1xuICBub25TdHJpY3RGdW5jdGlvbi5Db25zb2xlX3dhcm4uYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKTtcbn07XG5cbm5vblN0cmljdEZ1bmN0aW9uLmxvZyA9IGZ1bmN0aW9uICgpIHtcbiAgbm9uU3RyaWN0RnVuY3Rpb24uQ29uc29sZV93YXJuLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG59O1xuXG5leHBvcnRzLmNvcHkgPSBjb3B5O1xuZXhwb3J0cy5scGFkID0gbHBhZDtcbmV4cG9ydHMubm9uU3RyaWN0RnVuY3Rpb24gPSBub25TdHJpY3RGdW5jdGlvbjtcbmV4cG9ydHMucmVuZGVyMmRvbSA9IHJlbmRlcjJkb207XG5leHBvcnRzLnRpbWUyc3RyaW5nID0gdGltZTJzdHJpbmc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21tb24uanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmJ1aWxkVGVzdF9leGVjdXRlID0gZXhwb3J0cy5idWlsZFRlc3QgPSB1bmRlZmluZWQ7XG5cbnZhciBfY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxudmFyIGNvbW1vbiA9IF9pbnRlcm9wUmVxdWlyZVdpbGRjYXJkKF9jb21tb24pO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZChvYmopIHsgaWYgKG9iaiAmJiBvYmouX19lc01vZHVsZSkgeyByZXR1cm4gb2JqOyB9IGVsc2UgeyB2YXIgbmV3T2JqID0ge307IGlmIChvYmogIT0gbnVsbCkgeyBmb3IgKHZhciBrZXkgaW4gb2JqKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKSBuZXdPYmpba2V5XSA9IG9ialtrZXldOyB9IH0gbmV3T2JqLmRlZmF1bHQgPSBvYmo7IHJldHVybiBuZXdPYmo7IH0gfVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IGJ1aWxkVGVzdF9leGVjdXRlVGhpc1xuICpcbiAqIEBwcm9wZXJ0eSB7VGVzdFVuaXR9IHRlc3RcbiAqIEBwcm9wZXJ0eSB7VGVzdFR5cGV9IHR5cGVcbiAqXG4gKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIHtUZXN0VW5pdH0gdGVzdFVuaXRcbiAqL1xudmFyIGJ1aWxkVGVzdCA9IGZ1bmN0aW9uIGJ1aWxkVGVzdCh0ZXN0VW5pdCkge1xuXG4gIHZhciAvKiogQHR5cGUge3N0cmluZ30gICovbmFtZSwgLyoqIEB0eXBlIHtQcm9taXNlfSAqL3Byb21pc2U7XG5cbiAgcHJvbWlzZSA9IHRlc3RVbml0LmdldFByb21pc2UoKTtcblxuICBmb3IgKG5hbWUgaW4gVGVzdFR5cGUuYWxsKSB7XG4gICAgcHJvbWlzZVtuYW1lXSA9IGJ1aWxkVGVzdF9leGVjdXRlLmJpbmQoeyB0ZXN0OiB0ZXN0VW5pdCwgdHlwZTogVGVzdFR5cGUuYWxsW25hbWVdLCBwcm9taXNlOiBwcm9taXNlIH0pO1xuICB9XG5cbiAgcHJvbWlzZS50b2RvID0gdGVzdFVuaXQudG9kby5iaW5kKHRlc3RVbml0KTtcbiAgcHJvbWlzZS5jb21tZW50ID0gdGVzdFVuaXQuY29tbWVudC5iaW5kKHRlc3RVbml0KTtcbiAgcHJvbWlzZS5kZXNjcmliZSA9IHRlc3RVbml0LmRlc2NyaWJlLmJpbmQodGVzdFVuaXQpO1xuICBwcm9taXNlLm5vdGUgPSB0ZXN0VW5pdC5ub3RlLmJpbmQodGVzdFVuaXQpO1xuICBwcm9taXNlLmdldFJlc3VsdCA9IHRlc3RVbml0LmdldFJlc3VsdC5iaW5kKHRlc3RVbml0KTtcbiAgcHJvbWlzZS50aGVuID0gdGVzdFVuaXQudGhlbi5iaW5kKHRlc3RVbml0KTtcbiAgcHJvbWlzZS5jYXRjaCA9IHRlc3RVbml0LmNhdGNoLmJpbmQodGVzdFVuaXQpO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9taXNlLCAnbm90JywgeyBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHRlc3RVbml0Lm5vdDtyZXR1cm4gcHJvbWlzZTtcbiAgICB9IH0pO1xuXG4gIHByb21pc2UuJCA9IHRlc3RVbml0O1xuXG4gIHJldHVybiBwcm9taXNlO1xufTtcblxuLyoqXG4gKiBAdGhpcyBidWlsZFRlc3RfZXhlY3V0ZVRoaXNcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKi9cbnZhciBidWlsZFRlc3RfZXhlY3V0ZSA9IGZ1bmN0aW9uIGJ1aWxkVGVzdF9leGVjdXRlKCkge1xuICB0aGlzLnRlc3QudGVzdFR5cGUgPSB0aGlzLnR5cGU7XG4gIHRoaXMudGVzdC50ZXN0UGFyYW1ldGVycyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XG4gIHRoaXMudGVzdC50ZXN0UGFyYW1ldGVyc0V4cG9ydCA9IGNvbW1vbi5jb3B5KHRoaXMudGVzdC50ZXN0UGFyYW1ldGVycyk7XG4gIHRoaXMudGVzdC5jYWxjdWxhdGVkID0gZmFsc2U7XG4gIHRoaXMudGVzdC5lcnJvckV4cGVjdGVkID0gdGhpcy50eXBlLm9uZXJyb3I7XG4gIHRoaXMudGVzdC5yZWZyZXNoKCk7XG5cbiAgcmV0dXJuIHRoaXMucHJvbWlzZTtcbn07XG5cbmV4cG9ydHMuYnVpbGRUZXN0ID0gYnVpbGRUZXN0O1xuZXhwb3J0cy5idWlsZFRlc3RfZXhlY3V0ZSA9IGJ1aWxkVGVzdF9leGVjdXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZnVuY3Rpb25zLmpzLm1hcFxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgbGFuZyA9IHsgc2VjdGlvbjogeyBzdGFydERhdGU6ICdTdGFydCBkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kRGF0ZTogJ0VuZCBkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246ICdEdXJhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZDogJ3NlY29uZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50VG90YWw6ICd0b3RhbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50U3VjY2VzczogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudEZhaWw6ICdmYWlscycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllczogJ3llcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vOiAnbm8nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdDogeyBzdGFydFRpbWU6ICdTdGFydCB0aW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVGltZTogJ0VuZCB0aW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246ICdEdXJhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZDogJ3NlY29uZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50VG90YWw6ICdUZXN0cycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50U3VjY2VzczogJ1N1Y2Nlc3NlcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZhaWxfcGx1cmFsOiAnZmFpbHMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWlsOiAnZmFpbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHllczogJ3llcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vOiAnbm8nIH0gfTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gbGFuZztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhbmcuanMubWFwXG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfQ29udGV4dCA9IHJlcXVpcmUoJy4vQ29udGV4dCcpO1xuXG52YXIgX0NvbnRleHQyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfQ29udGV4dCk7XG5cbnZhciBfUHJvamVjdCA9IHJlcXVpcmUoJy4vUHJvamVjdCcpO1xuXG52YXIgX1Byb2plY3QyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfUHJvamVjdCk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbi8qXG5UaGlzIHNvZnR3YXJlIGluY2x1ZGUgdGhlIGZvbGxvd2luZyB0aGlyZC1wYXJ0eSBwcm9ncmFtcyA6XG5cbiAgIE1vY2hhXG4gICBPcmlnaW5hbCBTb3VyY2U6ICAgICBodHRwOi8vbW9jaGFqcy5vcmcvXG4gICBPcmlnaW5hbCBDb3B5cmlnaHQ6ICBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxNSBUSiBIb2xvd2F5Y2h1ayA8dGpAdmlzaW9uLW1lZGlhLmNhPlxuICAgT3JpZ2luYWwgTGljZW5zZTogICAgTUlUXG4qL1xuXG4vLyB2MC4xLjJcblxuLyoqXG4gKlxuICogRXhhbXBsZSA6XG4gKlxuICogdGVzdCgndGVzdCBzdWNjZXNzJywgdHJ1ZSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZXNzXG4gKlxuICogdGVzdCgndGVzdCBmYWlsJywgZmFsc2UpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWlsXG4gKlxuICogdGVzdCgnMScsIDEpLnRvRXF1YWwoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZXNzXG4gKiB0ZXN0KCcxJywgMSkudG9FcXVhbCgnMScpOyAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN1Y2Nlc3NcbiAqIHRlc3QoJzEnLCAxKS5zdHJpY3QudG9FcXVhbCgnMScpOyAgICAgICAgICAgICAgICAgICAgLy8gZmFpbFxuICogdGVzdCgnMScsIDEpLm5vdC50b0VxdWFsKCcxJyk7ICAgICAgICAgICAgICAgICAgICAgICAvLyBmYWxzZVxuICogdGVzdCgnMScsIDEpLm5vdC5zdHJpY3QudG9FcXVhbCgnMScpOyAgICAgICAgICAgICAgICAvLyBzdWNjZXNzXG4gKlxuICogdGVzdC5zZWN0aW9uKCdHcm91cHMnKTtcbiAqXG4gKiB0ZXN0KCdncm91cCB0cnVlJywgZnVuY3Rpb24oKSB7XG4gKiAgICByZXR1cm4gdHJ1ZTtcbiAqIH0pOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2Vzc1xuICpcbiAqIHRlc3QoJ2dyb3VwIDEsIG5vIHJldHVybicsIGZ1bmN0aW9uKCkge1xuICogICAgdGVzdCgnaW5uZXJHcm91cCA6IHRlc3Qgc3VjY2VzcycsIHRydWUpO1xuICogICAgdGVzdCgnaW5uZXJHcm91cCA6IHRlc3QgZmFpbGVkJywgZmFsc2UpO1xuICogfSk7XG4gKlxuICpcbiAqIHRlc3Quc2VjdGlvbignQXN5bmMnKTtcbiAqXG4gKiB0ZXN0LmFzeW5jKCdhc3luY0Z1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG4gKiAgICByZXR1cm4gMTtcbiAqIH0pLnRvRXF1YWwoMSk7IC8vIHN1Y2Nlc3NcbiAqXG4gKiB0ZXN0LmFzeW5jKCdhc3luY0Z1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG4gKlxuICogICAgdGVzdCgnYXN5bmNGdW5jdGlvbiA6IHN1Y2Nlc3MnLCB0cnVlKTsgICAgICAgICAgICAvLyBzdWNjZXNzXG4gKiAgICByZXR1cm4gJ2EgdmFsdWUnO1xuICpcbiAqIH0pLnRoZW4oZnVuY3Rpb24odGVzdCwgdmFsdWUpIHtcbiAqICAgIHRlc3QoJ2FzeW5jLnRoZW4nLCB2YWx1ZSkudG9CZUluc3RhbmNlb2YoU3RyaW5nKTsgLy8gc3VjY2Vzc1xuICogICAgcmV0dXJuIDFcbiAqIH0pLnRvRXF1YWwoMSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2Vzc1xuICpcbiAqL1xuXG52YXIgdGVzdCA9IGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBkZWZpbmU7XG5cbiAgZGVmaW5lID0gZnVuY3Rpb24gZGVmaW5lKCkgLy9ub2luc3BlY3Rpb24gSlNMaW50XG4gIHt9O1xuICBkZWZpbmUuYW1kID0gdW5kZWZpbmVkO1xuXG4gIC8qXG4gICAgICAqICAgIC0gc3RhcnREYXRlXG4gICAgICAqICAgIC0gZW5kRGF0ZVxuICAgICAgKiAgICAtIGR1cmF0aW9uXG4gICAgICAqICAgIC0gc2Vjb25kXG4gICAgICAqICAgIC0gY291bnRUb3RhbFxuICAgICAgKiAgICAtIGNvdW50U3VjY2Vzc1xuICAgICAgKiAgICAtIGNvdW50RmFpbFxuICAgICAgKiAgICAtIHllc1xuICAgICAgKiAgICAtIG5vXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBUZXN0RXhwb3J0XG4gICAqIEBwcm9wZXJ0eSB7U2VjdGlvbkV4cG9ydFtdfSBzZWN0aW9uc1xuICAgKlxuICAgKi9cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gU2VjdGlvbkV4cG9ydFxuICAgKiBAcHJvcGVydHkge1Rlc3RVbml0RXhwb3J0W119IHRlc3RVbml0c1xuICAgKiBAcHJvcGVydHkge3N0cmluZ30gICAgICAgICAgIHRpdGxlXG4gICAqXG4gICAqL1xuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBUZXN0VW5pdEV4cG9ydFxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59ICAgICAgICAgIGFzeW5jXG4gICAqIEBwcm9wZXJ0eSB7VGVzdEV4cG9ydH0gICAgICAgY2hpbGRUZXN0c1xuICAgKiBAcHJvcGVydHkge1Rlc3RVbml0RXhwb3J0W119IG5leHRUZXN0XG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICAgbm90XG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gICAgICAgICAgc3RyaWN0XG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSAgICAgICAgICAgdGl0bGVcbiAgICogQHByb3BlcnR5IHtzdHJpbmd9ICAgICAgICAgICB0eXBlXG4gICAqXG4gICAqL1xuXG4gIHZhciBwcm9qZWN0ID0gbmV3IF9Qcm9qZWN0Mi5kZWZhdWx0KCk7XG5cbiAgcmV0dXJuICgwLCBfQ29udGV4dDIuZGVmYXVsdCkocHJvamVjdCk7XG59KCk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGVzdDtcblxudHJ5IHtcbiAgd2luZG93LnRlc3QgPSB0ZXN0O1xufSBjYXRjaCAoZXgpIHt9XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWluLmpzLm1hcFxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG52YXIgdG9rZW4gPSB7fTtcblxuZXhwb3J0cy50b2tlbiA9IHRva2VuO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJpdmF0ZS5qcy5tYXBcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9kaXN0L2pzL21haW4nKTsiLCIvKiFcbiAqIG11c3RhY2hlLmpzIC0gTG9naWMtbGVzcyB7e211c3RhY2hlfX0gdGVtcGxhdGVzIHdpdGggSmF2YVNjcmlwdFxuICogaHR0cDovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qc1xuICovXG5cbi8qZ2xvYmFsIGRlZmluZTogZmFsc2UgTXVzdGFjaGU6IHRydWUqL1xuXG4oZnVuY3Rpb24gZGVmaW5lTXVzdGFjaGUgKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIGV4cG9ydHMgJiYgdHlwZW9mIGV4cG9ydHMubm9kZU5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgZmFjdG9yeShleHBvcnRzKTsgLy8gQ29tbW9uSlNcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpOyAvLyBBTURcbiAgfSBlbHNlIHtcbiAgICBnbG9iYWwuTXVzdGFjaGUgPSB7fTtcbiAgICBmYWN0b3J5KGdsb2JhbC5NdXN0YWNoZSk7IC8vIHNjcmlwdCwgd3NoLCBhc3BcbiAgfVxufSh0aGlzLCBmdW5jdGlvbiBtdXN0YWNoZUZhY3RvcnkgKG11c3RhY2hlKSB7XG5cbiAgdmFyIG9iamVjdFRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXlQb2x5ZmlsbCAob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdFRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgfTtcblxuICBmdW5jdGlvbiBpc0Z1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3JlIGNvcnJlY3QgdHlwZW9mIHN0cmluZyBoYW5kbGluZyBhcnJheVxuICAgKiB3aGljaCBub3JtYWxseSByZXR1cm5zIHR5cGVvZiAnb2JqZWN0J1xuICAgKi9cbiAgZnVuY3Rpb24gdHlwZVN0ciAob2JqKSB7XG4gICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/ICdhcnJheScgOiB0eXBlb2Ygb2JqO1xuICB9XG5cbiAgZnVuY3Rpb24gZXNjYXBlUmVnRXhwIChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1tcXC1cXFtcXF17fSgpKis/LixcXFxcXFxeJHwjXFxzXS9nLCAnXFxcXCQmJyk7XG4gIH1cblxuICAvKipcbiAgICogTnVsbCBzYWZlIHdheSBvZiBjaGVja2luZyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QsXG4gICAqIGluY2x1ZGluZyBpdHMgcHJvdG90eXBlLCBoYXMgYSBnaXZlbiBwcm9wZXJ0eVxuICAgKi9cbiAgZnVuY3Rpb24gaGFzUHJvcGVydHkgKG9iaiwgcHJvcE5hbWUpIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgKHByb3BOYW1lIGluIG9iaik7XG4gIH1cblxuICAvLyBXb3JrYXJvdW5kIGZvciBodHRwczovL2lzc3Vlcy5hcGFjaGUub3JnL2ppcmEvYnJvd3NlL0NPVUNIREItNTc3XG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vamFubC9tdXN0YWNoZS5qcy9pc3N1ZXMvMTg5XG4gIHZhciByZWdFeHBUZXN0ID0gUmVnRXhwLnByb3RvdHlwZS50ZXN0O1xuICBmdW5jdGlvbiB0ZXN0UmVnRXhwIChyZSwgc3RyaW5nKSB7XG4gICAgcmV0dXJuIHJlZ0V4cFRlc3QuY2FsbChyZSwgc3RyaW5nKTtcbiAgfVxuXG4gIHZhciBub25TcGFjZVJlID0gL1xcUy87XG4gIGZ1bmN0aW9uIGlzV2hpdGVzcGFjZSAoc3RyaW5nKSB7XG4gICAgcmV0dXJuICF0ZXN0UmVnRXhwKG5vblNwYWNlUmUsIHN0cmluZyk7XG4gIH1cblxuICB2YXIgZW50aXR5TWFwID0ge1xuICAgICcmJzogJyZhbXA7JyxcbiAgICAnPCc6ICcmbHQ7JyxcbiAgICAnPic6ICcmZ3Q7JyxcbiAgICAnXCInOiAnJnF1b3Q7JyxcbiAgICBcIidcIjogJyYjMzk7JyxcbiAgICAnLyc6ICcmI3gyRjsnLFxuICAgICdgJzogJyYjeDYwOycsXG4gICAgJz0nOiAnJiN4M0Q7J1xuICB9O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZUh0bWwgKHN0cmluZykge1xuICAgIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKC9bJjw+XCInYD1cXC9dL2csIGZ1bmN0aW9uIGZyb21FbnRpdHlNYXAgKHMpIHtcbiAgICAgIHJldHVybiBlbnRpdHlNYXBbc107XG4gICAgfSk7XG4gIH1cblxuICB2YXIgd2hpdGVSZSA9IC9cXHMqLztcbiAgdmFyIHNwYWNlUmUgPSAvXFxzKy87XG4gIHZhciBlcXVhbHNSZSA9IC9cXHMqPS87XG4gIHZhciBjdXJseVJlID0gL1xccypcXH0vO1xuICB2YXIgdGFnUmUgPSAvI3xcXF58XFwvfD58XFx7fCZ8PXwhLztcblxuICAvKipcbiAgICogQnJlYWtzIHVwIHRoZSBnaXZlbiBgdGVtcGxhdGVgIHN0cmluZyBpbnRvIGEgdHJlZSBvZiB0b2tlbnMuIElmIHRoZSBgdGFnc2BcbiAgICogYXJndW1lbnQgaXMgZ2l2ZW4gaGVyZSBpdCBtdXN0IGJlIGFuIGFycmF5IHdpdGggdHdvIHN0cmluZyB2YWx1ZXM6IHRoZVxuICAgKiBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZ3MgdXNlZCBpbiB0aGUgdGVtcGxhdGUgKGUuZy4gWyBcIjwlXCIsIFwiJT5cIiBdKS4gT2ZcbiAgICogY291cnNlLCB0aGUgZGVmYXVsdCBpcyB0byB1c2UgbXVzdGFjaGVzIChpLmUuIG11c3RhY2hlLnRhZ3MpLlxuICAgKlxuICAgKiBBIHRva2VuIGlzIGFuIGFycmF5IHdpdGggYXQgbGVhc3QgNCBlbGVtZW50cy4gVGhlIGZpcnN0IGVsZW1lbnQgaXMgdGhlXG4gICAqIG11c3RhY2hlIHN5bWJvbCB0aGF0IHdhcyB1c2VkIGluc2lkZSB0aGUgdGFnLCBlLmcuIFwiI1wiIG9yIFwiJlwiLiBJZiB0aGUgdGFnXG4gICAqIGRpZCBub3QgY29udGFpbiBhIHN5bWJvbCAoaS5lLiB7e215VmFsdWV9fSkgdGhpcyBlbGVtZW50IGlzIFwibmFtZVwiLiBGb3JcbiAgICogYWxsIHRleHQgdGhhdCBhcHBlYXJzIG91dHNpZGUgYSBzeW1ib2wgdGhpcyBlbGVtZW50IGlzIFwidGV4dFwiLlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIGVsZW1lbnQgb2YgYSB0b2tlbiBpcyBpdHMgXCJ2YWx1ZVwiLiBGb3IgbXVzdGFjaGUgdGFncyB0aGlzIGlzXG4gICAqIHdoYXRldmVyIGVsc2Ugd2FzIGluc2lkZSB0aGUgdGFnIGJlc2lkZXMgdGhlIG9wZW5pbmcgc3ltYm9sLiBGb3IgdGV4dCB0b2tlbnNcbiAgICogdGhpcyBpcyB0aGUgdGV4dCBpdHNlbGYuXG4gICAqXG4gICAqIFRoZSB0aGlyZCBhbmQgZm91cnRoIGVsZW1lbnRzIG9mIHRoZSB0b2tlbiBhcmUgdGhlIHN0YXJ0IGFuZCBlbmQgaW5kaWNlcyxcbiAgICogcmVzcGVjdGl2ZWx5LCBvZiB0aGUgdG9rZW4gaW4gdGhlIG9yaWdpbmFsIHRlbXBsYXRlLlxuICAgKlxuICAgKiBUb2tlbnMgdGhhdCBhcmUgdGhlIHJvb3Qgbm9kZSBvZiBhIHN1YnRyZWUgY29udGFpbiB0d28gbW9yZSBlbGVtZW50czogMSkgYW5cbiAgICogYXJyYXkgb2YgdG9rZW5zIGluIHRoZSBzdWJ0cmVlIGFuZCAyKSB0aGUgaW5kZXggaW4gdGhlIG9yaWdpbmFsIHRlbXBsYXRlIGF0XG4gICAqIHdoaWNoIHRoZSBjbG9zaW5nIHRhZyBmb3IgdGhhdCBzZWN0aW9uIGJlZ2lucy5cbiAgICovXG4gIGZ1bmN0aW9uIHBhcnNlVGVtcGxhdGUgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgaWYgKCF0ZW1wbGF0ZSlcbiAgICAgIHJldHVybiBbXTtcblxuICAgIHZhciBzZWN0aW9ucyA9IFtdOyAgICAgLy8gU3RhY2sgdG8gaG9sZCBzZWN0aW9uIHRva2Vuc1xuICAgIHZhciB0b2tlbnMgPSBbXTsgICAgICAgLy8gQnVmZmVyIHRvIGhvbGQgdGhlIHRva2Vuc1xuICAgIHZhciBzcGFjZXMgPSBbXTsgICAgICAgLy8gSW5kaWNlcyBvZiB3aGl0ZXNwYWNlIHRva2VucyBvbiB0aGUgY3VycmVudCBsaW5lXG4gICAgdmFyIGhhc1RhZyA9IGZhbHNlOyAgICAvLyBJcyB0aGVyZSBhIHt7dGFnfX0gb24gdGhlIGN1cnJlbnQgbGluZT9cbiAgICB2YXIgbm9uU3BhY2UgPSBmYWxzZTsgIC8vIElzIHRoZXJlIGEgbm9uLXNwYWNlIGNoYXIgb24gdGhlIGN1cnJlbnQgbGluZT9cblxuICAgIC8vIFN0cmlwcyBhbGwgd2hpdGVzcGFjZSB0b2tlbnMgYXJyYXkgZm9yIHRoZSBjdXJyZW50IGxpbmVcbiAgICAvLyBpZiB0aGVyZSB3YXMgYSB7eyN0YWd9fSBvbiBpdCBhbmQgb3RoZXJ3aXNlIG9ubHkgc3BhY2UuXG4gICAgZnVuY3Rpb24gc3RyaXBTcGFjZSAoKSB7XG4gICAgICBpZiAoaGFzVGFnICYmICFub25TcGFjZSkge1xuICAgICAgICB3aGlsZSAoc3BhY2VzLmxlbmd0aClcbiAgICAgICAgICBkZWxldGUgdG9rZW5zW3NwYWNlcy5wb3AoKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcGFjZXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaGFzVGFnID0gZmFsc2U7XG4gICAgICBub25TcGFjZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvcGVuaW5nVGFnUmUsIGNsb3NpbmdUYWdSZSwgY2xvc2luZ0N1cmx5UmU7XG4gICAgZnVuY3Rpb24gY29tcGlsZVRhZ3MgKHRhZ3NUb0NvbXBpbGUpIHtcbiAgICAgIGlmICh0eXBlb2YgdGFnc1RvQ29tcGlsZSA9PT0gJ3N0cmluZycpXG4gICAgICAgIHRhZ3NUb0NvbXBpbGUgPSB0YWdzVG9Db21waWxlLnNwbGl0KHNwYWNlUmUsIDIpO1xuXG4gICAgICBpZiAoIWlzQXJyYXkodGFnc1RvQ29tcGlsZSkgfHwgdGFnc1RvQ29tcGlsZS5sZW5ndGggIT09IDIpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0YWdzOiAnICsgdGFnc1RvQ29tcGlsZSk7XG5cbiAgICAgIG9wZW5pbmdUYWdSZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKHRhZ3NUb0NvbXBpbGVbMF0pICsgJ1xcXFxzKicpO1xuICAgICAgY2xvc2luZ1RhZ1JlID0gbmV3IFJlZ0V4cCgnXFxcXHMqJyArIGVzY2FwZVJlZ0V4cCh0YWdzVG9Db21waWxlWzFdKSk7XG4gICAgICBjbG9zaW5nQ3VybHlSZSA9IG5ldyBSZWdFeHAoJ1xcXFxzKicgKyBlc2NhcGVSZWdFeHAoJ30nICsgdGFnc1RvQ29tcGlsZVsxXSkpO1xuICAgIH1cblxuICAgIGNvbXBpbGVUYWdzKHRhZ3MgfHwgbXVzdGFjaGUudGFncyk7XG5cbiAgICB2YXIgc2Nhbm5lciA9IG5ldyBTY2FubmVyKHRlbXBsYXRlKTtcblxuICAgIHZhciBzdGFydCwgdHlwZSwgdmFsdWUsIGNociwgdG9rZW4sIG9wZW5TZWN0aW9uO1xuICAgIHdoaWxlICghc2Nhbm5lci5lb3MoKSkge1xuICAgICAgc3RhcnQgPSBzY2FubmVyLnBvcztcblxuICAgICAgLy8gTWF0Y2ggYW55IHRleHQgYmV0d2VlbiB0YWdzLlxuICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChvcGVuaW5nVGFnUmUpO1xuXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpIDwgdmFsdWVMZW5ndGg7ICsraSkge1xuICAgICAgICAgIGNociA9IHZhbHVlLmNoYXJBdChpKTtcblxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoY2hyKSkge1xuICAgICAgICAgICAgc3BhY2VzLnB1c2godG9rZW5zLmxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vblNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0b2tlbnMucHVzaChbICd0ZXh0JywgY2hyLCBzdGFydCwgc3RhcnQgKyAxIF0pO1xuICAgICAgICAgIHN0YXJ0ICs9IDE7XG5cbiAgICAgICAgICAvLyBDaGVjayBmb3Igd2hpdGVzcGFjZSBvbiB0aGUgY3VycmVudCBsaW5lLlxuICAgICAgICAgIGlmIChjaHIgPT09ICdcXG4nKVxuICAgICAgICAgICAgc3RyaXBTcGFjZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE1hdGNoIHRoZSBvcGVuaW5nIHRhZy5cbiAgICAgIGlmICghc2Nhbm5lci5zY2FuKG9wZW5pbmdUYWdSZSkpXG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBoYXNUYWcgPSB0cnVlO1xuXG4gICAgICAvLyBHZXQgdGhlIHRhZyB0eXBlLlxuICAgICAgdHlwZSA9IHNjYW5uZXIuc2Nhbih0YWdSZSkgfHwgJ25hbWUnO1xuICAgICAgc2Nhbm5lci5zY2FuKHdoaXRlUmUpO1xuXG4gICAgICAvLyBHZXQgdGhlIHRhZyB2YWx1ZS5cbiAgICAgIGlmICh0eXBlID09PSAnPScpIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChlcXVhbHNSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhbihlcXVhbHNSZSk7XG4gICAgICAgIHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdUYWdSZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd7Jykge1xuICAgICAgICB2YWx1ZSA9IHNjYW5uZXIuc2NhblVudGlsKGNsb3NpbmdDdXJseVJlKTtcbiAgICAgICAgc2Nhbm5lci5zY2FuKGN1cmx5UmUpO1xuICAgICAgICBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgICB0eXBlID0gJyYnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBzY2FubmVyLnNjYW5VbnRpbChjbG9zaW5nVGFnUmUpO1xuICAgICAgfVxuXG4gICAgICAvLyBNYXRjaCB0aGUgY2xvc2luZyB0YWcuXG4gICAgICBpZiAoIXNjYW5uZXIuc2NhbihjbG9zaW5nVGFnUmUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHRhZyBhdCAnICsgc2Nhbm5lci5wb3MpO1xuXG4gICAgICB0b2tlbiA9IFsgdHlwZSwgdmFsdWUsIHN0YXJ0LCBzY2FubmVyLnBvcyBdO1xuICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuXG4gICAgICBpZiAodHlwZSA9PT0gJyMnIHx8IHR5cGUgPT09ICdeJykge1xuICAgICAgICBzZWN0aW9ucy5wdXNoKHRva2VuKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJy8nKSB7XG4gICAgICAgIC8vIENoZWNrIHNlY3Rpb24gbmVzdGluZy5cbiAgICAgICAgb3BlblNlY3Rpb24gPSBzZWN0aW9ucy5wb3AoKTtcblxuICAgICAgICBpZiAoIW9wZW5TZWN0aW9uKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5vcGVuZWQgc2VjdGlvbiBcIicgKyB2YWx1ZSArICdcIiBhdCAnICsgc3RhcnQpO1xuXG4gICAgICAgIGlmIChvcGVuU2VjdGlvblsxXSAhPT0gdmFsdWUpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmNsb3NlZCBzZWN0aW9uIFwiJyArIG9wZW5TZWN0aW9uWzFdICsgJ1wiIGF0ICcgKyBzdGFydCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICduYW1lJyB8fCB0eXBlID09PSAneycgfHwgdHlwZSA9PT0gJyYnKSB7XG4gICAgICAgIG5vblNwYWNlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJz0nKSB7XG4gICAgICAgIC8vIFNldCB0aGUgdGFncyBmb3IgdGhlIG5leHQgdGltZSBhcm91bmQuXG4gICAgICAgIGNvbXBpbGVUYWdzKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBNYWtlIHN1cmUgdGhlcmUgYXJlIG5vIG9wZW4gc2VjdGlvbnMgd2hlbiB3ZSdyZSBkb25lLlxuICAgIG9wZW5TZWN0aW9uID0gc2VjdGlvbnMucG9wKCk7XG5cbiAgICBpZiAob3BlblNlY3Rpb24pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuY2xvc2VkIHNlY3Rpb24gXCInICsgb3BlblNlY3Rpb25bMV0gKyAnXCIgYXQgJyArIHNjYW5uZXIucG9zKTtcblxuICAgIHJldHVybiBuZXN0VG9rZW5zKHNxdWFzaFRva2Vucyh0b2tlbnMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21iaW5lcyB0aGUgdmFsdWVzIG9mIGNvbnNlY3V0aXZlIHRleHQgdG9rZW5zIGluIHRoZSBnaXZlbiBgdG9rZW5zYCBhcnJheVxuICAgKiB0byBhIHNpbmdsZSB0b2tlbi5cbiAgICovXG4gIGZ1bmN0aW9uIHNxdWFzaFRva2VucyAodG9rZW5zKSB7XG4gICAgdmFyIHNxdWFzaGVkVG9rZW5zID0gW107XG5cbiAgICB2YXIgdG9rZW4sIGxhc3RUb2tlbjtcbiAgICBmb3IgKHZhciBpID0gMCwgbnVtVG9rZW5zID0gdG9rZW5zLmxlbmd0aDsgaSA8IG51bVRva2VuczsgKytpKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcblxuICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgIGlmICh0b2tlblswXSA9PT0gJ3RleHQnICYmIGxhc3RUb2tlbiAmJiBsYXN0VG9rZW5bMF0gPT09ICd0ZXh0Jykge1xuICAgICAgICAgIGxhc3RUb2tlblsxXSArPSB0b2tlblsxXTtcbiAgICAgICAgICBsYXN0VG9rZW5bM10gPSB0b2tlblszXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcXVhc2hlZFRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzcXVhc2hlZFRva2VucztcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtcyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgaW50byBhIG5lc3RlZCB0cmVlIHN0cnVjdHVyZSB3aGVyZVxuICAgKiB0b2tlbnMgdGhhdCByZXByZXNlbnQgYSBzZWN0aW9uIGhhdmUgdHdvIGFkZGl0aW9uYWwgaXRlbXM6IDEpIGFuIGFycmF5IG9mXG4gICAqIGFsbCB0b2tlbnMgdGhhdCBhcHBlYXIgaW4gdGhhdCBzZWN0aW9uIGFuZCAyKSB0aGUgaW5kZXggaW4gdGhlIG9yaWdpbmFsXG4gICAqIHRlbXBsYXRlIHRoYXQgcmVwcmVzZW50cyB0aGUgZW5kIG9mIHRoYXQgc2VjdGlvbi5cbiAgICovXG4gIGZ1bmN0aW9uIG5lc3RUb2tlbnMgKHRva2Vucykge1xuICAgIHZhciBuZXN0ZWRUb2tlbnMgPSBbXTtcbiAgICB2YXIgY29sbGVjdG9yID0gbmVzdGVkVG9rZW5zO1xuICAgIHZhciBzZWN0aW9ucyA9IFtdO1xuXG4gICAgdmFyIHRva2VuLCBzZWN0aW9uO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldO1xuXG4gICAgICBzd2l0Y2ggKHRva2VuWzBdKSB7XG4gICAgICAgIGNhc2UgJyMnOlxuICAgICAgICBjYXNlICdeJzpcbiAgICAgICAgICBjb2xsZWN0b3IucHVzaCh0b2tlbik7XG4gICAgICAgICAgc2VjdGlvbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29sbGVjdG9yID0gdG9rZW5bNF0gPSBbXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnLyc6XG4gICAgICAgICAgc2VjdGlvbiA9IHNlY3Rpb25zLnBvcCgpO1xuICAgICAgICAgIHNlY3Rpb25bNV0gPSB0b2tlblsyXTtcbiAgICAgICAgICBjb2xsZWN0b3IgPSBzZWN0aW9ucy5sZW5ndGggPiAwID8gc2VjdGlvbnNbc2VjdGlvbnMubGVuZ3RoIC0gMV1bNF0gOiBuZXN0ZWRUb2tlbnM7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgY29sbGVjdG9yLnB1c2godG9rZW4pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXN0ZWRUb2tlbnM7XG4gIH1cblxuICAvKipcbiAgICogQSBzaW1wbGUgc3RyaW5nIHNjYW5uZXIgdGhhdCBpcyB1c2VkIGJ5IHRoZSB0ZW1wbGF0ZSBwYXJzZXIgdG8gZmluZFxuICAgKiB0b2tlbnMgaW4gdGVtcGxhdGUgc3RyaW5ncy5cbiAgICovXG4gIGZ1bmN0aW9uIFNjYW5uZXIgKHN0cmluZykge1xuICAgIHRoaXMuc3RyaW5nID0gc3RyaW5nO1xuICAgIHRoaXMudGFpbCA9IHN0cmluZztcbiAgICB0aGlzLnBvcyA9IDA7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHRhaWwgaXMgZW1wdHkgKGVuZCBvZiBzdHJpbmcpLlxuICAgKi9cbiAgU2Nhbm5lci5wcm90b3R5cGUuZW9zID0gZnVuY3Rpb24gZW9zICgpIHtcbiAgICByZXR1cm4gdGhpcy50YWlsID09PSAnJztcbiAgfTtcblxuICAvKipcbiAgICogVHJpZXMgdG8gbWF0Y2ggdGhlIGdpdmVuIHJlZ3VsYXIgZXhwcmVzc2lvbiBhdCB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICogUmV0dXJucyB0aGUgbWF0Y2hlZCB0ZXh0IGlmIGl0IGNhbiBtYXRjaCwgdGhlIGVtcHR5IHN0cmluZyBvdGhlcndpc2UuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5zY2FuID0gZnVuY3Rpb24gc2NhbiAocmUpIHtcbiAgICB2YXIgbWF0Y2ggPSB0aGlzLnRhaWwubWF0Y2gocmUpO1xuXG4gICAgaWYgKCFtYXRjaCB8fCBtYXRjaC5pbmRleCAhPT0gMClcbiAgICAgIHJldHVybiAnJztcblxuICAgIHZhciBzdHJpbmcgPSBtYXRjaFswXTtcblxuICAgIHRoaXMudGFpbCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoc3RyaW5nLmxlbmd0aCk7XG4gICAgdGhpcy5wb3MgKz0gc3RyaW5nLmxlbmd0aDtcblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG5cbiAgLyoqXG4gICAqIFNraXBzIGFsbCB0ZXh0IHVudGlsIHRoZSBnaXZlbiByZWd1bGFyIGV4cHJlc3Npb24gY2FuIGJlIG1hdGNoZWQuIFJldHVybnNcbiAgICogdGhlIHNraXBwZWQgc3RyaW5nLCB3aGljaCBpcyB0aGUgZW50aXJlIHRhaWwgaWYgbm8gbWF0Y2ggY2FuIGJlIG1hZGUuXG4gICAqL1xuICBTY2FubmVyLnByb3RvdHlwZS5zY2FuVW50aWwgPSBmdW5jdGlvbiBzY2FuVW50aWwgKHJlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy50YWlsLnNlYXJjaChyZSksIG1hdGNoO1xuXG4gICAgc3dpdGNoIChpbmRleCkge1xuICAgICAgY2FzZSAtMTpcbiAgICAgICAgbWF0Y2ggPSB0aGlzLnRhaWw7XG4gICAgICAgIHRoaXMudGFpbCA9ICcnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgbWF0Y2ggPSAnJztcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBtYXRjaCA9IHRoaXMudGFpbC5zdWJzdHJpbmcoMCwgaW5kZXgpO1xuICAgICAgICB0aGlzLnRhaWwgPSB0aGlzLnRhaWwuc3Vic3RyaW5nKGluZGV4KTtcbiAgICB9XG5cbiAgICB0aGlzLnBvcyArPSBtYXRjaC5sZW5ndGg7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgYSByZW5kZXJpbmcgY29udGV4dCBieSB3cmFwcGluZyBhIHZpZXcgb2JqZWN0IGFuZFxuICAgKiBtYWludGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGNvbnRleHQuXG4gICAqL1xuICBmdW5jdGlvbiBDb250ZXh0ICh2aWV3LCBwYXJlbnRDb250ZXh0KSB7XG4gICAgdGhpcy52aWV3ID0gdmlldztcbiAgICB0aGlzLmNhY2hlID0geyAnLic6IHRoaXMudmlldyB9O1xuICAgIHRoaXMucGFyZW50ID0gcGFyZW50Q29udGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNvbnRleHQgdXNpbmcgdGhlIGdpdmVuIHZpZXcgd2l0aCB0aGlzIGNvbnRleHRcbiAgICogYXMgdGhlIHBhcmVudC5cbiAgICovXG4gIENvbnRleHQucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoICh2aWV3KSB7XG4gICAgcmV0dXJuIG5ldyBDb250ZXh0KHZpZXcsIHRoaXMpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gbmFtZSBpbiB0aGlzIGNvbnRleHQsIHRyYXZlcnNpbmdcbiAgICogdXAgdGhlIGNvbnRleHQgaGllcmFyY2h5IGlmIHRoZSB2YWx1ZSBpcyBhYnNlbnQgaW4gdGhpcyBjb250ZXh0J3Mgdmlldy5cbiAgICovXG4gIENvbnRleHQucHJvdG90eXBlLmxvb2t1cCA9IGZ1bmN0aW9uIGxvb2t1cCAobmFtZSkge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuY2FjaGU7XG5cbiAgICB2YXIgdmFsdWU7XG4gICAgaWYgKGNhY2hlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICB2YWx1ZSA9IGNhY2hlW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsIG5hbWVzLCBpbmRleCwgbG9va3VwSGl0ID0gZmFsc2U7XG5cbiAgICAgIHdoaWxlIChjb250ZXh0KSB7XG4gICAgICAgIGlmIChuYW1lLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHQudmlldztcbiAgICAgICAgICBuYW1lcyA9IG5hbWUuc3BsaXQoJy4nKTtcbiAgICAgICAgICBpbmRleCA9IDA7XG5cbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBVc2luZyB0aGUgZG90IG5vdGlvbiBwYXRoIGluIGBuYW1lYCwgd2UgZGVzY2VuZCB0aHJvdWdoIHRoZVxuICAgICAgICAgICAqIG5lc3RlZCBvYmplY3RzLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVG8gYmUgY2VydGFpbiB0aGF0IHRoZSBsb29rdXAgaGFzIGJlZW4gc3VjY2Vzc2Z1bCwgd2UgaGF2ZSB0b1xuICAgICAgICAgICAqIGNoZWNrIGlmIHRoZSBsYXN0IG9iamVjdCBpbiB0aGUgcGF0aCBhY3R1YWxseSBoYXMgdGhlIHByb3BlcnR5XG4gICAgICAgICAgICogd2UgYXJlIGxvb2tpbmcgZm9yLiBXZSBzdG9yZSB0aGUgcmVzdWx0IGluIGBsb29rdXBIaXRgLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogVGhpcyBpcyBzcGVjaWFsbHkgbmVjZXNzYXJ5IGZvciB3aGVuIHRoZSB2YWx1ZSBoYXMgYmVlbiBzZXQgdG9cbiAgICAgICAgICAgKiBgdW5kZWZpbmVkYCBhbmQgd2Ugd2FudCB0byBhdm9pZCBsb29raW5nIHVwIHBhcmVudCBjb250ZXh0cy5cbiAgICAgICAgICAgKiovXG4gICAgICAgICAgd2hpbGUgKHZhbHVlICE9IG51bGwgJiYgaW5kZXggPCBuYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gbmFtZXMubGVuZ3RoIC0gMSlcbiAgICAgICAgICAgICAgbG9va3VwSGl0ID0gaGFzUHJvcGVydHkodmFsdWUsIG5hbWVzW2luZGV4XSk7XG5cbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWVbbmFtZXNbaW5kZXgrK11dO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGNvbnRleHQudmlld1tuYW1lXTtcbiAgICAgICAgICBsb29rdXBIaXQgPSBoYXNQcm9wZXJ0eShjb250ZXh0LnZpZXcsIG5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxvb2t1cEhpdClcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjb250ZXh0ID0gY29udGV4dC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNhY2hlW25hbWVdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKVxuICAgICAgdmFsdWUgPSB2YWx1ZS5jYWxsKHRoaXMudmlldyk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEEgV3JpdGVyIGtub3dzIGhvdyB0byB0YWtlIGEgc3RyZWFtIG9mIHRva2VucyBhbmQgcmVuZGVyIHRoZW0gdG8gYVxuICAgKiBzdHJpbmcsIGdpdmVuIGEgY29udGV4dC4gSXQgYWxzbyBtYWludGFpbnMgYSBjYWNoZSBvZiB0ZW1wbGF0ZXMgdG9cbiAgICogYXZvaWQgdGhlIG5lZWQgdG8gcGFyc2UgdGhlIHNhbWUgdGVtcGxhdGUgdHdpY2UuXG4gICAqL1xuICBmdW5jdGlvbiBXcml0ZXIgKCkge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYWxsIGNhY2hlZCB0ZW1wbGF0ZXMgaW4gdGhpcyB3cml0ZXIuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgICB0aGlzLmNhY2hlID0ge307XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiBgdGVtcGxhdGVgIGFuZCByZXR1cm5zIHRoZSBhcnJheSBvZiB0b2tlbnNcbiAgICogdGhhdCBpcyBnZW5lcmF0ZWQgZnJvbSB0aGUgcGFyc2UuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5jYWNoZTtcbiAgICB2YXIgdG9rZW5zID0gY2FjaGVbdGVtcGxhdGVdO1xuXG4gICAgaWYgKHRva2VucyA9PSBudWxsKVxuICAgICAgdG9rZW5zID0gY2FjaGVbdGVtcGxhdGVdID0gcGFyc2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgdGFncyk7XG5cbiAgICByZXR1cm4gdG9rZW5zO1xuICB9O1xuXG4gIC8qKlxuICAgKiBIaWdoLWxldmVsIG1ldGhvZCB0aGF0IGlzIHVzZWQgdG8gcmVuZGVyIHRoZSBnaXZlbiBgdGVtcGxhdGVgIHdpdGhcbiAgICogdGhlIGdpdmVuIGB2aWV3YC5cbiAgICpcbiAgICogVGhlIG9wdGlvbmFsIGBwYXJ0aWFsc2AgYXJndW1lbnQgbWF5IGJlIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZVxuICAgKiBuYW1lcyBhbmQgdGVtcGxhdGVzIG9mIHBhcnRpYWxzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIHRlbXBsYXRlLiBJdCBtYXlcbiAgICogYWxzbyBiZSBhIGZ1bmN0aW9uIHRoYXQgaXMgdXNlZCB0byBsb2FkIHBhcnRpYWwgdGVtcGxhdGVzIG9uIHRoZSBmbHlcbiAgICogdGhhdCB0YWtlcyBhIHNpbmdsZSBhcmd1bWVudDogdGhlIG5hbWUgb2YgdGhlIHBhcnRpYWwuXG4gICAqL1xuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlciAodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKSB7XG4gICAgdmFyIHRva2VucyA9IHRoaXMucGFyc2UodGVtcGxhdGUpO1xuICAgIHZhciBjb250ZXh0ID0gKHZpZXcgaW5zdGFuY2VvZiBDb250ZXh0KSA/IHZpZXcgOiBuZXcgQ29udGV4dCh2aWV3KTtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5zLCBjb250ZXh0LCBwYXJ0aWFscywgdGVtcGxhdGUpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBMb3ctbGV2ZWwgbWV0aG9kIHRoYXQgcmVuZGVycyB0aGUgZ2l2ZW4gYXJyYXkgb2YgYHRva2Vuc2AgdXNpbmdcbiAgICogdGhlIGdpdmVuIGBjb250ZXh0YCBhbmQgYHBhcnRpYWxzYC5cbiAgICpcbiAgICogTm90ZTogVGhlIGBvcmlnaW5hbFRlbXBsYXRlYCBpcyBvbmx5IGV2ZXIgdXNlZCB0byBleHRyYWN0IHRoZSBwb3J0aW9uXG4gICAqIG9mIHRoZSBvcmlnaW5hbCB0ZW1wbGF0ZSB0aGF0IHdhcyBjb250YWluZWQgaW4gYSBoaWdoZXItb3JkZXIgc2VjdGlvbi5cbiAgICogSWYgdGhlIHRlbXBsYXRlIGRvZXNuJ3QgdXNlIGhpZ2hlci1vcmRlciBzZWN0aW9ucywgdGhpcyBhcmd1bWVudCBtYXlcbiAgICogYmUgb21pdHRlZC5cbiAgICovXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVyVG9rZW5zID0gZnVuY3Rpb24gcmVuZGVyVG9rZW5zICh0b2tlbnMsIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIGJ1ZmZlciA9ICcnO1xuXG4gICAgdmFyIHRva2VuLCBzeW1ib2wsIHZhbHVlO1xuICAgIGZvciAodmFyIGkgPSAwLCBudW1Ub2tlbnMgPSB0b2tlbnMubGVuZ3RoOyBpIDwgbnVtVG9rZW5zOyArK2kpIHtcbiAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICBzeW1ib2wgPSB0b2tlblswXTtcblxuICAgICAgaWYgKHN5bWJvbCA9PT0gJyMnKSB2YWx1ZSA9IHRoaXMucmVuZGVyU2VjdGlvbih0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnXicpIHZhbHVlID0gdGhpcy5yZW5kZXJJbnZlcnRlZCh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgICAgZWxzZSBpZiAoc3ltYm9sID09PSAnPicpIHZhbHVlID0gdGhpcy5yZW5kZXJQYXJ0aWFsKHRva2VuLCBjb250ZXh0LCBwYXJ0aWFscywgb3JpZ2luYWxUZW1wbGF0ZSk7XG4gICAgICBlbHNlIGlmIChzeW1ib2wgPT09ICcmJykgdmFsdWUgPSB0aGlzLnVuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ25hbWUnKSB2YWx1ZSA9IHRoaXMuZXNjYXBlZFZhbHVlKHRva2VuLCBjb250ZXh0KTtcbiAgICAgIGVsc2UgaWYgKHN5bWJvbCA9PT0gJ3RleHQnKSB2YWx1ZSA9IHRoaXMucmF3VmFsdWUodG9rZW4pO1xuXG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZClcbiAgICAgICAgYnVmZmVyICs9IHZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBidWZmZXI7XG4gIH07XG5cbiAgV3JpdGVyLnByb3RvdHlwZS5yZW5kZXJTZWN0aW9uID0gZnVuY3Rpb24gcmVuZGVyU2VjdGlvbiAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBidWZmZXIgPSAnJztcbiAgICB2YXIgdmFsdWUgPSBjb250ZXh0Lmxvb2t1cCh0b2tlblsxXSk7XG5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gcmVuZGVyIGFuIGFyYml0cmFyeSB0ZW1wbGF0ZVxuICAgIC8vIGluIHRoZSBjdXJyZW50IGNvbnRleHQgYnkgaGlnaGVyLW9yZGVyIHNlY3Rpb25zLlxuICAgIGZ1bmN0aW9uIHN1YlJlbmRlciAodGVtcGxhdGUpIHtcbiAgICAgIHJldHVybiBzZWxmLnJlbmRlcih0ZW1wbGF0ZSwgY29udGV4dCwgcGFydGlhbHMpO1xuICAgIH1cblxuICAgIGlmICghdmFsdWUpIHJldHVybjtcblxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgZm9yICh2YXIgaiA9IDAsIHZhbHVlTGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBqIDwgdmFsdWVMZW5ndGg7ICsraikge1xuICAgICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZVtqXSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgICBidWZmZXIgKz0gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQucHVzaCh2YWx1ZSksIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICBpZiAodHlwZW9mIG9yaWdpbmFsVGVtcGxhdGUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCB1c2UgaGlnaGVyLW9yZGVyIHNlY3Rpb25zIHdpdGhvdXQgdGhlIG9yaWdpbmFsIHRlbXBsYXRlJyk7XG5cbiAgICAgIC8vIEV4dHJhY3QgdGhlIHBvcnRpb24gb2YgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIHRoYXQgdGhlIHNlY3Rpb24gY29udGFpbnMuXG4gICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwoY29udGV4dC52aWV3LCBvcmlnaW5hbFRlbXBsYXRlLnNsaWNlKHRva2VuWzNdLCB0b2tlbls1XSksIHN1YlJlbmRlcik7XG5cbiAgICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgICBidWZmZXIgKz0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlciArPSB0aGlzLnJlbmRlclRva2Vucyh0b2tlbls0XSwgY29udGV4dCwgcGFydGlhbHMsIG9yaWdpbmFsVGVtcGxhdGUpO1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmVuZGVySW52ZXJ0ZWQgPSBmdW5jdGlvbiByZW5kZXJJbnZlcnRlZCAodG9rZW4sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuXG4gICAgLy8gVXNlIEphdmFTY3JpcHQncyBkZWZpbml0aW9uIG9mIGZhbHN5LiBJbmNsdWRlIGVtcHR5IGFycmF5cy5cbiAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2phbmwvbXVzdGFjaGUuanMvaXNzdWVzLzE4NlxuICAgIGlmICghdmFsdWUgfHwgKGlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMCkpXG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJUb2tlbnModG9rZW5bNF0sIGNvbnRleHQsIHBhcnRpYWxzLCBvcmlnaW5hbFRlbXBsYXRlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnJlbmRlclBhcnRpYWwgPSBmdW5jdGlvbiByZW5kZXJQYXJ0aWFsICh0b2tlbiwgY29udGV4dCwgcGFydGlhbHMpIHtcbiAgICBpZiAoIXBhcnRpYWxzKSByZXR1cm47XG5cbiAgICB2YXIgdmFsdWUgPSBpc0Z1bmN0aW9uKHBhcnRpYWxzKSA/IHBhcnRpYWxzKHRva2VuWzFdKSA6IHBhcnRpYWxzW3Rva2VuWzFdXTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlclRva2Vucyh0aGlzLnBhcnNlKHZhbHVlKSwgY29udGV4dCwgcGFydGlhbHMsIHZhbHVlKTtcbiAgfTtcblxuICBXcml0ZXIucHJvdG90eXBlLnVuZXNjYXBlZFZhbHVlID0gZnVuY3Rpb24gdW5lc2NhcGVkVmFsdWUgKHRva2VuLCBjb250ZXh0KSB7XG4gICAgdmFyIHZhbHVlID0gY29udGV4dC5sb29rdXAodG9rZW5bMV0pO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKVxuICAgICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUuZXNjYXBlZFZhbHVlID0gZnVuY3Rpb24gZXNjYXBlZFZhbHVlICh0b2tlbiwgY29udGV4dCkge1xuICAgIHZhciB2YWx1ZSA9IGNvbnRleHQubG9va3VwKHRva2VuWzFdKTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbClcbiAgICAgIHJldHVybiBtdXN0YWNoZS5lc2NhcGUodmFsdWUpO1xuICB9O1xuXG4gIFdyaXRlci5wcm90b3R5cGUucmF3VmFsdWUgPSBmdW5jdGlvbiByYXdWYWx1ZSAodG9rZW4pIHtcbiAgICByZXR1cm4gdG9rZW5bMV07XG4gIH07XG5cbiAgbXVzdGFjaGUubmFtZSA9ICdtdXN0YWNoZS5qcyc7XG4gIG11c3RhY2hlLnZlcnNpb24gPSAnMi4yLjEnO1xuICBtdXN0YWNoZS50YWdzID0gWyAne3snLCAnfX0nIF07XG5cbiAgLy8gQWxsIGhpZ2gtbGV2ZWwgbXVzdGFjaGUuKiBmdW5jdGlvbnMgdXNlIHRoaXMgd3JpdGVyLlxuICB2YXIgZGVmYXVsdFdyaXRlciA9IG5ldyBXcml0ZXIoKTtcblxuICAvKipcbiAgICogQ2xlYXJzIGFsbCBjYWNoZWQgdGVtcGxhdGVzIGluIHRoZSBkZWZhdWx0IHdyaXRlci5cbiAgICovXG4gIG11c3RhY2hlLmNsZWFyQ2FjaGUgPSBmdW5jdGlvbiBjbGVhckNhY2hlICgpIHtcbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5jbGVhckNhY2hlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBhcnNlcyBhbmQgY2FjaGVzIHRoZSBnaXZlbiB0ZW1wbGF0ZSBpbiB0aGUgZGVmYXVsdCB3cml0ZXIgYW5kIHJldHVybnMgdGhlXG4gICAqIGFycmF5IG9mIHRva2VucyBpdCBjb250YWlucy4gRG9pbmcgdGhpcyBhaGVhZCBvZiB0aW1lIGF2b2lkcyB0aGUgbmVlZCB0b1xuICAgKiBwYXJzZSB0ZW1wbGF0ZXMgb24gdGhlIGZseSBhcyB0aGV5IGFyZSByZW5kZXJlZC5cbiAgICovXG4gIG11c3RhY2hlLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UgKHRlbXBsYXRlLCB0YWdzKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRXcml0ZXIucGFyc2UodGVtcGxhdGUsIHRhZ3MpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZW5kZXJzIHRoZSBgdGVtcGxhdGVgIHdpdGggdGhlIGdpdmVuIGB2aWV3YCBhbmQgYHBhcnRpYWxzYCB1c2luZyB0aGVcbiAgICogZGVmYXVsdCB3cml0ZXIuXG4gICAqL1xuICBtdXN0YWNoZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIgKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscykge1xuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHRlbXBsYXRlISBUZW1wbGF0ZSBzaG91bGQgYmUgYSBcInN0cmluZ1wiICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYnV0IFwiJyArIHR5cGVTdHIodGVtcGxhdGUpICsgJ1wiIHdhcyBnaXZlbiBhcyB0aGUgZmlyc3QgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcmd1bWVudCBmb3IgbXVzdGFjaGUjcmVuZGVyKHRlbXBsYXRlLCB2aWV3LCBwYXJ0aWFscyknKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVmYXVsdFdyaXRlci5yZW5kZXIodGVtcGxhdGUsIHZpZXcsIHBhcnRpYWxzKTtcbiAgfTtcblxuICAvLyBUaGlzIGlzIGhlcmUgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggMC40LnguLFxuICAvKmVzbGludC1kaXNhYmxlICovIC8vIGVzbGludCB3YW50cyBjYW1lbCBjYXNlZCBmdW5jdGlvbiBuYW1lXG4gIG11c3RhY2hlLnRvX2h0bWwgPSBmdW5jdGlvbiB0b19odG1sICh0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMsIHNlbmQpIHtcbiAgICAvKmVzbGludC1lbmFibGUqL1xuXG4gICAgdmFyIHJlc3VsdCA9IG11c3RhY2hlLnJlbmRlcih0ZW1wbGF0ZSwgdmlldywgcGFydGlhbHMpO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oc2VuZCkpIHtcbiAgICAgIHNlbmQocmVzdWx0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH07XG5cbiAgLy8gRXhwb3J0IHRoZSBlc2NhcGluZyBmdW5jdGlvbiBzbyB0aGF0IHRoZSB1c2VyIG1heSBvdmVycmlkZSBpdC5cbiAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9qYW5sL211c3RhY2hlLmpzL2lzc3Vlcy8yNDRcbiAgbXVzdGFjaGUuZXNjYXBlID0gZXNjYXBlSHRtbDtcblxuICAvLyBFeHBvcnQgdGhlc2UgbWFpbmx5IGZvciB0ZXN0aW5nLCBidXQgYWxzbyBmb3IgYWR2YW5jZWQgdXNhZ2UuXG4gIG11c3RhY2hlLlNjYW5uZXIgPSBTY2FubmVyO1xuICBtdXN0YWNoZS5Db250ZXh0ID0gQ29udGV4dDtcbiAgbXVzdGFjaGUuV3JpdGVyID0gV3JpdGVyO1xuXG59KSk7XG4iXX0=
