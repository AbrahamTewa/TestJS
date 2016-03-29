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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=DOMTest.js.map
