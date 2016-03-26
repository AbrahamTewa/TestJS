import Context       from './Context';
import Section       from './Section';
import TestExecution from './TestExecution';
import TestType      from './TestType';

import { buildTest_execute } from './functions';

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
var TestUnit                                  = function TestUnit(param) {

   this.catchTests     = [];
   this.calculated     = false;
   this.comments       = [];
   this.completed      = false;
   this.context        = param.context;
   this.creationDate   = new Date();
   this.enabled        = param.enabled;
   this.id             = TestUnit.lastId ++;
   this.nexts          = [];
   this.notMode        = false;
   this.parent         = param.parent;
   this.promiseRole    = param.promiseRole;
   this.project        = param.project;
   this.timeout        = param.timeout;
   this.strictMode     = param.strict;
   this.tests          = [];
   this.title          = param.title;
   this.value          = param.value;
   this.executionDelay = param.executionDelay;
   this.errorExpected  = false;
   this.toDoList       = [];
   this.errors         = [];
   this.testType       = undefined;

   this.notes          = [];

   this.async          = param.async || this.executionDelay !== false || this.value instanceof Promise || this.value instanceof TestUnit;

   this._isClosed      = false;

   this.results        = { error     : undefined
                         , test      : undefined
                         , timeout   : undefined
                         , validity  : undefined

                           // Theses are the values return by the "count" functions. They are updated by the "refresh" function.
                         , count     : { errors    : 0
                                       , fails     : 0
                                       , successes : 0
                                       , total     : 0}};

   // Child tests
   this.childContext   = Context(this);
   this.currentSection = new Section(this.project, '', true, this);
   this.sections       = [this.currentSection];

   if (typeof(this.value) === 'function') {
      this.testFunction  = this.value;
      this.testExecution = new TestExecution(this);
   }

   if (!this.enabled)
      return;

   this.buildPromise();

   this.execute();
};

/**
 *
 * @returns {Promise}
 */
TestUnit.prototype.buildPromise               = function buildPromise() {

   var /** @type {string}  */ name;

   this.promise        = new Promise(function(fullfill, reject) {
      this.fullfillPromise = fullfill;
      this.rejectPromise   = reject;
   }.bind(this));

   this.promiseThenFunction  = this.promise.then.bind(this.promise);

   for(name in TestType.all) {
      this.promise[name] = buildTest_execute.bind({test : this, type : TestType.all[name], promise: this.promise});
   }

   this.promise.todo      = this.todo.bind(this);
   this.promise.comment   = this.comment.bind(this);
   this.promise.describe  = this.describe.bind(this);
   this.promise.note      = this.note.bind(this);
   this.promise.getResult = this.getResult.bind(this);
   this.promise.then      = this.then.bind(this);
   this.promise.catch     = this.catch.bind(this);

   // Adding the "not" keyword
   Object.defineProperty(this.promise, 'not', { get : function () { this.not(); return this.promise}.bind(this)});

   this.promise.$ = this;
};

/**
 * Calculate the result of the test
 */
TestUnit.prototype.calcResult                 = function calcResult() {

   var /** @type {Array}    */ params
     , /** @type {boolean}  */ result
     , /** @type {TestType} */ testType
     , value;

   if (this.errorExpected)
      value = this.error;
   else
      value = this.value;

   testType = this.testType ? this.testType : TestType.all.isTrue;

   if (!this.isUnitTest()) {
      this.results.validity = this.isValid();
      this.calculated = true;
      return;
   }

   this.results.validity = true;

   // Creating parameters list for the test function
   params = [value].concat(this.testParameters);

   // If no errors has been raised, then we continue
   if (this.results.error && !this.errorExpected)
      result = false;
   else if (this.errorExpected && !this.results.error)
      result = false;
   else {

      try {
         if (this.strictMode && testType.strictTest !== undefined)
            result = testType.strictTest.apply(undefined, params);
         else
            result = testType.test.apply(undefined, params);
      }
      catch (e) {
         result = false;
      }

      if (this.notMode)
         result = !result;
   }

   this.results.test = result;
   this.calculated   = true;

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
TestUnit.prototype['catch']                   = function (param1, param2) {
   if (arguments.length === 1)
      return this.then(undefined, param1);
   else
      return this.then(param1, undefined, param2);
};

/**
 *
 * @param {string} comment
 * @returns {TestUnit}
 */
TestUnit.prototype.comment                    = function comment(comment) {
   this.comments.push(comment);
   return this.getPromise();
};

/**
 *
 * @param {boolean} isError
 * @param {*}       value
 */
TestUnit.prototype.complete                   = function complete(isError, value) {

   this.completed = true;

   if (!isError && this.testExecution) {
      isError   = this.testExecution.throwError;

      if (isError)
         value = this.testExecution.error;
   }

   if (isError) {
      this.error         = value;
      this.results.error = true;
   }
   else {
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
TestUnit.prototype.console                    = function console(failedOnly) {

   var /** @type {string}  */ logText
     , /** @type {number}  */ s
     , /** @type {number}  */ successes
     , /** @type {number}  */ total;

   failedOnly = undefined ? false : failedOnly;

   successes = this.countSuccessfulTests();
   total     = this.countTotalTests();

   logText = (this.getTitle() !== undefined ? this.getTitle() + ' : ' : '') + (successes === total ? 'success' : 'fail');

   if (total > 1) {
      logText += ' - ' + successes + '/' + total;
      nonStrictFunction.groupCollapsed(logText);

      if (this.sections.length > 1) {
         for (s in this.sections) {

            if (failedOnly)
               if (this.sections[s].isSuccessful())
                  continue;

            if (this.sections[s].countTotalTests() === 0)
               continue;

            this.sections[s].console(failedOnly);
         }
      }
      else {

         for (s in tests) {
            if (failedOnly)
               if (tests[s].isSuccessful())
                  continue;

            this.sections[0].tests[s].console();
         }

      }

      nonStrictFunction.groupEnd();

   }
   else {

      if (this.isSuccessful())
         nonStrictFunction.log(logText);
      else
         nonStrictFunction.warn(logText);
   }

   return this;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countErrors                = function countError() {
   return this.results.count.errors;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countFailedTests           = function countFailedTests() {
   return this.results.count.fails;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countSuccessfulTests       = function countSuccessfulTests() {
   return this.results.count.successes;
};

/**
 *
 * @returns {number}
 */
TestUnit.prototype.countTotalTests            = function countTotalTests() {
   return this.results.count.total;
};

/**
  *
  * @param {string} description
  */
TestUnit.prototype.describe                   = function describe(description) {
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
TestUnit.prototype.done                       = function done() {
   this.testExecution.done();
   return this.getPromise();
};

/**
 * Execute the unit test
 * TODO : This function could by simplify
 *
 */
TestUnit.prototype.execute                    = function execute() {
   var /** @type {function} */ fullfillFunction
     , /** @type {Promise}  */ promise
     , /** @type {function} */ rejectFunction
     , /** @type {function} */ thenFunction;

   if (!this.enabled)
      return;

   if (this.async || this.value instanceof Promise) {

      // The value is a promise
      if (this.value.$ instanceof TestUnit) {

         thenFunction = function() {
            return this.value.$.getResult();
         }.bind(this);

         promise = this.value.$.promiseThenFunction(thenFunction, thenFunction);
      }

      else if (this.value instanceof Promise) {
         promise = this.value;
      }

      // Test using the "delay" function
      else if (this.executionDelay !== false) {

         promise = new Promise(function(fullfill, reject) {
            fullfillFunction = fullfill;
            rejectFunction   = reject;
         });

         setTimeout(function() {
            try {
               fullfillFunction(this.testExecution.execute(this.value));
            }
            catch (err) {
               rejectFunction(err);
            }
         }.bind(this), this.executionDelay);

      }

      // Standard "async" call
      else if (this.promiseRole === undefined) {

         promise = Promise.resolve().then(function() {
            return this.testExecution.execute(this.value);
         }.bind(this));

      }

      // Test call by a "then" function
      else if (this.promiseRole === 'then')

         promise = this.parent.promiseThenFunction(function(value) {
            return this.testExecution.execute(value);
         }.bind(this));

      // Test call by a "catch" function
      else
         promise = this.parent.promiseThenFunction(undefined, function(error) {
            return this.testExecution.execute(error);
         }.bind(this));

   }
   else if (this.testFunction) {
      this.value = this.testExecution.execute();

      if (this.value instanceof Promise)
         promise = this.value;
   }

   if (promise !== undefined) {

      if (promise.$ instanceof TestUnit) {
         promise.$.promiseThenFunction ( function(value) {
                  this.complete(false, value);
               }.bind(this)
                                       , function(error) {
                  this.complete(true, error);
               }.bind(this));
      }
      else {
         promise.then ( function(value) {
                  this.complete(false, value);
               }.bind(this)
                      , function(error) {
                  this.complete(true , error);
               }.bind(this));
      }
   }
   else
      this.complete(false, this.value);
};

/**
 *
 * @returns {string[]}
 */
TestUnit.prototype.getComments                = function getComments() {
   return this.comments.slice(0);
};

/**
 * Return the promise that will be executed once all the test and sub-tests (including promises tests) are finished
 *
 * @returns {Promise}
 */
TestUnit.prototype.getCompletedPromise        = function getCompletedPromise() {

   var /** @type {number}    */ i
     , /** @type {Promise[]} */ promises;

   promises = [this.getPromise()];

   for(i in this.sections) {
      promises.push(this.sections[i].getCompletedPromise());
   }

   for(i in this.nexts) {
      promises.push(this.nexts[i].getCompletedPromise());
   }

   return Promise.all(promises);
};

/**
 * @param {boolean} [failedOnly=false]
 * @returns {TestUnitExport}
 */
TestUnit.prototype.getData                    = function getData(failedOnly) {

   var /** @type {Object}           */ data
     , /** @type {number}           */ n
     , /** @type {TestUnitExport[]} */ nexts
     , /** @type {number}           */ s;

   nexts = [];

   failedOnly = failedOnly === undefined ? false : failedOnly;

   for (n in this.nexts) {

      if (failedOnly)
         if (this.nexts[n].isSuccessful())
            continue;

      nexts.push(this.nexts[n].getData(failedOnly));
   }

   data = { async         : this.async
          , enabled       : this.enabled
          , id            : this.id
          , nexts         : nexts
          , not           : this.notMode
          , result        : this.results.test
          , sections      : []
          , strict        : this.strictMode
          , testParameters: this.testParametersExport
          , title         : this.title
          , type          : 'TestUnit'
          , value         : this.value
   };

   for (s in this.sections) {

      if (failedOnly)
         if (this.sections[s].isSuccessful())
            continue;

      // If the first section is empty, we skip it
      if (s == 0 && this.sections[s].countTotalTests() === 0)
         continue;

      data.sections.push(this.sections[s].getData(failedOnly))
   }

   if (this.testType)
      data['test'] = this.testType.code;

   return data;
};

/**
 *
 * @returns {string}
 */
TestUnit.prototype.getDescription             = function getDescription() {
   return this.description;
};

/**
 *
 * @returns {boolean}
 */
TestUnit.prototype.getDurationResult          = function getDurationResult() {
   return this.durationResult;
};

/**
 *
 * @returns {DOMTest}
 */
TestUnit.prototype.getDOM                     = function getDOM() {
   return this.domTest;
};

/**
 *
 * @returns {Date}
 */
TestUnit.prototype.getEndDate                 = function getEndDate() {
   if (this.testFunction)
      return this.testExecution.getEndDate();

   return this.creationDate;
};

/**
 *
 * @returns {number|undefined}
 */
TestUnit.prototype.getEndTime                 = function getEndTime() {
   this.getProject().getTime(this.getEndDate());
};

/**
 *
 * @returns {TestPromise}
 */
TestUnit.prototype.getPromise                 = function getPromise() {
   return this.promise;
};

/**
 *
 * @returns {Project}
 */
TestUnit.prototype.getProject                 = function getProject() {
   return this.project;
};

//noinspection JSUnusedGlobalSymbols
/**
 *
 * @returns {TestUnit[]}
 */
TestUnit.prototype.getNexts                   = function getNexts() {
   return this.nexts.slice(0);
};

/**
 * Return all notes of the test
 * @returns {string[]}
 */
TestUnit.prototype.getNotes                   = function getNotes() {
   return this.notes.slice(0);
};

/**
 * Return the result of the test.
 * Do not take care of the timeout of the function nor the child tests
 *
 * @returns {boolean}
 */
TestUnit.prototype.getResult                  = function getResult() {
   if (this.results.test     === false)
      return false;

   if (this.results.count.fails > 0)
      return false;

   if (this.results.validity === false)
      return false;

   return this.results.timeout !== false;
};

/**
 *
 * @returns {Section[]}
 */
TestUnit.prototype.getSections                = function getSections() {
   return this.sections.slice(0);
};

/**
 *
 * @returns {Date}
 */
TestUnit.prototype.getStartDate               = function getStartDate() {
   if (this.testFunction)
      return this.testExecution.getStartDate();

   return this.creationDate;
};

/**
 *
 * @returns {number|undefined}
 */
TestUnit.prototype.getStartTime               = function getStartTime() {
   return this.getProject().getTime(this.getStartDate());
};

/**
 *
 * @returns {function}
 */
TestUnit.prototype.getTestFunction            = function getTestFunction() {
   return this.testFunction;
};

/**
 *
 * @returns {string|undefined}
 */
TestUnit.prototype.getTitle                   = function getTitle() {
   return this.title;
};

/**
 *
 * @returns {Array.<string>}
 */
TestUnit.prototype.getToDoList                = function getToDoList() {
   return this.toDoList.slice(0);
};

/**
 *
 * @returns {*}
 */
TestUnit.prototype.getValue                   = function getValue() {
   return this.value;
};

/**
 *
 * @returns {boolean}
 */
TestUnit.prototype.hasAsyncTests              = function hasAsyncTests() {

   var /** @type {number} */ n
     , /** @type {number} */ s;

   if (this.asyncTests !== undefined)
      return this.asyncTests;

   if (this.async) {
      this.asyncTests = true;
      return true;
   }

   for(n in this.nexts) {
      if (this.nexts[n].hasAsyncTests()) {
         this.asyncTests = true;
         return true;
      }
   }

   for(s in this.sections) {
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
TestUnit.prototype.hasFinished                = function hasFinished() {

   var /** @type {number} */ n
     , /** @type {number} */ s;

   if (this._hasFinished === true)
      return this._hasFinished;

   if (this.testFunction) {
      if (!this.testExecution.hasFinished())
         return false;
   }


   for(s in this.sections) {
      if (!this.sections[s].hasFinished())
         return false;
   }

   for(n in this.nexts) {
      if (!this.nexts[n].hasFinished())
         return false;
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
TestUnit.prototype.hasFinishedInTime          = function hasFinishedInTime() {

   if (!this.testFunction)
      return true;

   if (this.timeout === undefined)
      return true;

   if (this.testExecution.hasFinished())
      return this.testExecution.getDuration() < this.timeout;

   return this.testExecution.getDuration(true) >= this.timeout ? false : undefined;
};

/**
 * Indicate if the test is closed (true) or not (false).
 * A test is closed if it has finished or as reached the timeout
 * @returns {boolean}
 */
TestUnit.prototype.isClosed                   = function isClosed() {
   if (this._isClosed === true)
      return true;

   if (this.hasFinished()) {
      this._isClosed = true;
      return true;
   }

   if (this.hasFinishedInTime() === false) {
      this._isClosed = true;
      return true;
   }

};

TestUnit.prototype.isGroup                    = function isGroup() {
   if (this.sections.length > 1)
      return true;

   if (this.nexts.length > 0)
      return true;

   return this.sections[0].getTests().length > 0;
};

/**
 * @returns {boolean}
 */
TestUnit.prototype.isSuccessful               = function isSuccessful() {

   var /** @type {number} */ s
     , /** @type {number} */ t;

   if (this.getResult() === false)
      return false;

   for (s in this.sections) {
      if (!this.sections[s].isSuccessful())
         return false;
   }

   for (t in this.nexts) {
      if (!this.nexts[t].isSuccessful())
         return false;
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
TestUnit.prototype.isUnitTest                 = function isUnitTest() {

   // If there is no test function, then it's that a value has been provided
   //noinspection JSValidateTypes
   if (this.testFunction === undefined)
      return true;

   if (this.testType !== undefined)
      return true;

   if (this.timeout !== undefined)
      return true;

   //noinspection RedundantConditionalExpressionJS
   return this.value !== undefined && !(this.value instanceof Promise || this.value instanceof TestUnit) ? true : false;
};

/**
 * Indicate if the test is va valid test or not.
 * A test is invalid if it's not a unit test and if it didn't defined any other test/sections (no child tests, no promises tests)
 *
 * @returns {boolean}
 */
TestUnit.prototype.isValid                    = function isValid() {

   if (this.isUnitTest())
      return true;

   return this.isGroup();
};

/**
 * Invert the sens of the test
 * @returns {TestPromise}
 */
TestUnit.prototype.not                        = function not() {
   this.notMode = true;
   return this.getPromise();
};

/**
 *
 * @param {string} note
 */
TestUnit.prototype.note                       = function note(note) {
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
TestUnit.prototype.refresh                    = function refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal) {

   var /** @type {*}       */ error
     , /** @type {number}  */ errors
     , /** @type {number}  */ fails
     , /** @type {boolean} */ hasFinishedInTime
     , /** @type {number}  */ s
     , /** @type {number}  */ successes
     , /** @type {number}  */ t
     , /** @type {number}  */ total;

   if (this.completed && !this.calculated) {

      if (this.results.error) {
         this.calculated = true;
         this.rejectPromise(this.error);
      }

      if (!this.results.error || this.errorExpected) {
         try {
            this.calcResult();
            if (!this.results.error)
               this.fullfillPromise(this.value);
         }
         catch(error) {
            this.error = error;
            this.results.error = true;
            this.rejectPromise(this.error);
         }
      }
   }

   // We refresh only if counts have already been done
   if (this.results.count.total === undefined)
      return;

   if (deltaTotal !== undefined && this.results.count.total !== undefined) {
      this.results.count.deltaErrors += deltaErrors;
      this.results.count.fails       += deltaFails;
      this.results.count.successes   += deltaSuccesses;
      this.results.count.total       += deltaTotal;
      this.results.count.isValid      = this.isValid();
   }
   else {

      this.errors = [];

      // Calculating validity only if the test was previously invalid
      // Note : a valid test can't become invalid (because a invalid test is basically a test without results nor sub tests).
      if (!this.results.validity)
         this.results.validity = this.isValid();

      // Errors
      errors = 0;
      if (this.results.error && !this.errorExpected) {
         errors += 1;
         this.errors.push('The test has raised an exception');
      }
      else if (!this.results.error && this.errorExpected) {
         errors += 1;
         this.errors.push('The test should have raise an exception');
      }

      // Fails
      fails  = this.isUnitTest() && !this.results.test ? 1 : 0;
      fails += errors;
      fails += !this.results.validity ? 1 : 0;

      if (this.isUnitTest() && !this.results.test)
         this.errors.push('The test has failed');

      if (!this.results.validity)
         this.errors.push('Not a valid test');

      hasFinishedInTime = this.hasFinishedInTime();

      if (hasFinishedInTime !== undefined && !hasFinishedInTime)
         fails += 1;

      // Successes
      successes  = this.isUnitTest() && this.results.test ? 1 : 0;
      successes += this.timeout !== undefined && this.results.timeout ? 1 : 0;

      if (this.testFunction && this.timeout !== undefined) {
         // Note : if the test hasn't finished in time, then we have another fail
         hasFinishedInTime = this.hasFinishedInTime();

         if (hasFinishedInTime !== undefined && !hasFinishedInTime)
            successes += 1;
      }

      // Total
      total  = this.isUnitTest() ? 1 : 0;
      total += this.timeout !== undefined;

      for (s in this.sections) {
         errors    += this.sections[s].countErrors();
         fails     += this.sections[s].countFailedTests();
         successes += this.sections[s].countSuccessfulTests();
         total     += this.sections[s].countTotalTests();
      }

      for (t in this.nexts) {
         errors    += this.nexts[s].countErrors();
         fails     += this.nexts[t].countFailedTests();
         successes += this.nexts[t].countSuccessfulTests();
         total     += this.nexts[t].countTotalTests();
      }

      if (this.results.count.total !== undefined) {
         deltaErrors    = errors    - this.results.count.errors;
         deltaFails     = fails     - this.results.count.fails;
         deltaSuccesses = successes - this.results.count.successes;
         deltaTotal     = total     - this.results.count.total;
      }

      this.results.count = { errors    : errors
                           , fails     : fails
                           , successes : successes
                           , total     : total};

   }

   if (this.parent !== undefined) {
      if (this.parent.results.count.total !== undefined)
         this.parent.refresh(deltaErrors, deltaFails, deltaSuccesses, deltaTotal);
   }

   if (this.getDOM())
      this.getDOM().refresh();

};

/**
 *
 * @param {DOMTest} dom
 */
TestUnit.prototype.setDOM                     = function setDOM(dom) {
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
TestUnit.prototype.then                       = function then(param1, param2, param3) {

   var /** @type {function} */ catchFunction
     , /** @type {TestUnit} */ catchTest
     , /** @type {function} */ thenFunction
     , /** @type {TestUnit} */ thenTest
     , /** @type {string}   */ title;

   // .then(fct, fct);
   // .then(fct);
   // .then(undefined, fct);
   // .then('test', undefined, fct);
   // .then(undefined, undefined, fct);

   if (arguments.length === 1) {
      title = undefined;
      thenFunction = param1;
   }
   else if (arguments.length == 2) {
      if (typeof(param1) === 'string') {
         title = param1;
         thenFunction = param2;
      }
      else {
         title = undefined;
         thenFunction = param1;
         catchFunction = param2;
      }
   }
   else if (arguments.length === 3) {
      title = param1;
      thenFunction = param2;
      catchFunction = param3;
   }

   if (thenFunction != undefined) {
      thenTest = new TestUnit({ async          : true
                              , context        : this.childContext
                              , enabled        : this.enabled
                              , executionDelay : false
                              , strict         : this.strictMode
                              , parent         : this
                              , project        : this.getProject()
                              , promiseRole    : 'then'
                              , title          : title
                              , value          : thenFunction});

      this.nexts.push(thenTest);
   }

   if (catchFunction != undefined) {
      catchTest = new TestUnit({ async          : true
                               , context        : this.childContext
                               , enabled        : this.enabled
                               , executionDelay : false
                               , strict         : this.strictMode
                               , parent         : this
                               , project        : this.getProject()
                               , promiseRole    : 'catch'
                               , title          : title
                               , value          : catchFunction});

      this.catchTests.push(catchTest);
   }

   this.refresh();

   if (thenTest != undefined)
      return thenTest.getPromise();
   else
      return catchTest.getPromise();
};

TestUnit.prototype.todo                       = function todo(text) {
   this.toDoList.push(text);
   return this.getPromise();
};

/**
 *
 * @returns {string}
 */
TestUnit.prototype.toString                   = function toString() {
   return this.title + ' : ' + (this.isSuccessful() ? 'success' : 'fail') + ' (' + this.countSuccessfulTests() + '/' + this.countTotalTests() + ')';
};

/**
 *
 * @param {number} id
 * @returns {TestUnit}
 */
TestUnit.get                                  = function(id) {
   return TestUnit.ALL[id];
};

/**
 * Last ID used for for a test
 * @type {number}
 */
TestUnit.lastId                               = 0;

/**
 * List of all tests
 * @type {TestUnit[]}
 */
TestUnit.ALL                                  = [];

TestUnit.TYPES                                = { test : 'test'
                                                , unit : 'unit'};

/**
 *
 * @type {Object.<TestType>}
 * @namespace TestUnit
 */
TestUnit.TEST_TYPES = {};

export default TestUnit;