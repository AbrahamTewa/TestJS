'use strict';

Object.defineProperty(exports, "__esModule", {
   value: true
});

var _DOMTest = require('./DOMTest');

var _DOMTest2 = _interopRequireDefault(_DOMTest);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=DOMSection.js.map
