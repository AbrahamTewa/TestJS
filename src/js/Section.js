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
var Section                                   = function Section(project, title, defaultSection, parent) {

   this.id             = Section.maxID++;
   this.title          = title;
   this.tests          = [];
   this.project        = project;
   this.parent         = parent;
   this.defaultSection = defaultSection;

   this.results        = { count     : { errors    : 0
                                       , fails     : 0
                                       , successes : 0
                                       , total     : 0}};

};

/**
 *
 * @param {TestUnit} test
 */
Section.prototype.addTest                     = function addTest(test) {

   var /** @type {TestUnit|Section} */ parent;

   this.tests.push(test);

   /*this.then(function() {
      return test;
   });*/

   if (this.asyncTests === false) {
      if (test.hasAsyncTests()) {
         this.asyncTests = true;

         parent = this.parent;

         // Updating parents : we all the parents who call the
         while(parent !== undefined && (parent ? parent : {}).asyncTests !== true) {
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
Section.prototype.refresh                       = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {
   var /** @type {number} */ errors
     , /** @type {number} */ fails
     , /** @type {number} */ successes
     , /** @type {number} */ t
     , /** @type {number} */ total;

   if (deltaTotal !== undefined && this.results.count.fails !== undefined) {
      this.results.count.errors    += deltaErrors;
      this.results.count.fails     += deltaFails;
      this.results.count.successes += deltaSuccesses;
      this.results.count.total     += deltaTotal;
   }
   else {
      errors    = this.results.count.errors;
      fails     = this.results.count.fails;
      successes = this.results.count.successes;
      total     = this.results.count.total;

      this.results.count.errors    = 0;
      this.results.count.fails     = 0;
      this.results.count.successes = 0;
      this.results.count.total     = 0;

      for(t in this.tests) {
         this.results.count.errors    += this.tests[t].countErrors();
         this.results.count.fails     += this.tests[t].countFailedTests();
         this.results.count.successes += this.tests[t].countSuccessfulTests();
         this.results.count.total     += this.tests[t].countTotalTests();
      }

      if (this.results.count.total !== undefined) {
         deltaErrors    = errors    - this.results.count.errors;
         deltaFails     = fails     - this.results.count.fails;
         deltaSuccesses = successes - this.results.count.successes;
         deltaTotal     = total     - this.results.count.total;
      }
   }

   if (this.parent !== undefined)
      if (this.parent.results.count.total !== undefined)
         this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);

   if (this.getDOM())
      this.getDOM().refresh();

};

/**
 *
 * @param {boolean} failedOnly
 */
Section.prototype.console                     = function(failedOnly) {

   var /** @type {number} */ successes
     , /** @type {number} */ t
     , /** @type {number} */ total;

   successes = this.countSuccessfulTests();
   total     = this.countTotalTests();

   nonStrictFunction.groupCollapsed((this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail') + ' : ' + successes + '/' + total);

   for(t in this.tests) {

      if (failedOnly)
         if (this.tests[t].isSuccessful())
            continue;

      this.tests[t].console(failedOnly);
   }

   nonStrictFunction.groupEnd();
};

/**
 * Return the total number of errors that hasn't been handled
 * @returns {number}
 */
Section.prototype.countErrors                 = function() {
   return this.results.count.errors;
};

/**
 * Return the number of failed tests inside the section
 * @returns {number}
 */
Section.prototype.countFailedTests            = function countFailedTests() {
   return this.results.count.fails;
};

/**
 *
 * @returns {number}
 */
Section.prototype.countSuccessfulTests        = function countSuccessfulTests() {
   return this.results.count.successes;
};

/**
 *
 * @returns {number}
 */
Section.prototype.countTotalTests             = function countTotalTests() {
   return this.results.count.total;
};

//noinspection ReservedWordAsName
/**
 *
 * @returns {Promise}
 */
Section.prototype.catch                       = function () {
   this._hasFinished = false;
   return Promise.prototype.catch.apply(this.getPromise(), arguments);
};

//noinspection JSUnusedGlobalSymbols
/**
 * @param {string} description
 */
Section.prototype.describe                    = function describe(description) {
   this.description = description;
};

/**
 * @returns {Promise}
 */
Section.prototype.getPromise                  = function getPromise() {

   if (this.promise === undefined)
      this.promise = promiseResolved;

   return this.promise;
};

/**
 *
 * @return {Promise}
 */
Section.prototype.getCompletedPromise         = function getCompletedPromise() {

   var /** @type {number} */ i
     , /** @type {Promise[]} */ promises;

   promises = [];
   for(i in this.tests) {
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
Section.prototype.getData                     = function getData(failedOnly) {

   var /** @type {number}      */ t
      , /** @type {TestUnit[]} */ tests;

   tests = [];
   failedOnly = failedOnly === undefined ? false : failedOnly;

   for (t in this.tests) {

      if (failedOnly)
         if (this.tests[t].isSuccessful())
            continue;

      tests.push(this.tests[t].getData());
   }

   return { tests : tests
          , title : this.title
   };
};

/**
 *
 * @returns {string}
 */
Section.prototype.getDescription              = function getDescription() {
   return this.description;
};

/**
 *
 * @returns {DOMSection}
 */
Section.prototype.getDOM                      = function getDOM() {
   return this.domSection;
};

/**
 * @returns {Date}
 */
Section.prototype.getEndDate                  = function getEndDate() {
   if (this.tests.length === 0)
      return undefined;

   this.tests[this.tests.length - 1].getEndDate();
};

/**
 *
 * @returns {number|undefined}
 */
Section.prototype.getEndTime                  = function getEndTime() {
   return this.project.getTime(this.getEndDate());
};

/**
 * @returns {Date}
 *
 */
Section.prototype.getStartDate                = function getStartDate() {
   if (this.tests.length === 0)
      return undefined;

   return this.tests[0].getStartDate();
};

/**
 *
 * @returns {number}
 */
Section.prototype.getStartTime                = function getStartTime() {
   return this.project.getTime(this.getStartDate());
};

/**
 *
 * @returns {TestUnit[]}
 */
Section.prototype.getTests                    = function getTests() {
   return this.tests.slice(0);
};

/**
 * Return the title of the section
 * @returns {string|undefined}
 */
Section.prototype.getTitle                    = function getTitle() {
   return !this.title ? '' : this.title;
};

/**
 *
 * @returns {boolean}
 */
Section.prototype.hasAsyncTests               = function hasAsyncTests() {

   var /** @type {number} */ t;

   if (this.asyncTests !== undefined)
      return true;

   for(t in this.tests) {
      if (this.tests[t].hasAsyncTests()) {
         this.asyncTests = true;
         return true;
      }
   }

   return false;
};

Section.prototype.hasFinished                 = function hasFinished() {
   var /** @type {number} */ i;

   if (this._hasFinished)
      return this._hasFinished;

   for(i in this.tests) {
      if (!this.tests[i].hasFinished())
         return false;
   }

   this._hasFinished = true;

   return this._hasFinished;
};

/**
 *
 * @returns {boolean}
 */
Section.prototype.isDefault                   = function isDefault() {
   return this.defaultSection;
};

/**
 *  @returns {boolean}
 */
Section.prototype.isSuccessful                = function isSuccessful() {
   var /** @type {number}  */ i;

   if (!this.hasFinished())
      return false;

   for(i in this.tests) {
      if (!this.tests[i].isSuccessful())
         return false;
   }

   return true;
};

/**
 * @param {DOMSection} dom
 */
Section.prototype.setDOM                      = function setDOM(dom) {
   this.domSection = dom;
};

/**
* @returns {Promise}
*/
Section.prototype.then                        = function() {
   this._hasFinished = false;
   return Promise.prototype.then.apply(this.getPromise(), arguments);
};

Section.maxID = 0;

export default Section;