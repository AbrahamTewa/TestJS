import { token } from './private';

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
var TestExecution                             = function TestExecution (test) {
   this.test         = test;
   this.testFunction = this.test.getTestFunction();
   this.childContext = this.test.childContext;
   this.async        = this.test.async;
   this.context      = this.test.context;
};

TestExecution.prototype.done                  = function done() {
   this.endDate = new Date();
};

/**
 * Execute the function
 */
TestExecution.prototype.execute               = function execute() {

   var /** @type {*}                   */ err
     , /** @type {ThisTestContextInfo} */ oldInfo
     , /** @type {Array}               */ params;

   // Building parameters for the function :
   // The first parameter is the "test" function
   // The second parameter is the first argument provided to the execute function.
   params = [this.test.childContext];

   if (arguments.length === 1)
      params.push(arguments[0]);

   // We have to change the context of the "test" function
   oldInfo = this.context.info;

   //noinspection JSValidateTypes
   this.context.reset(token, this.childContext._info(token));

   this.startDate = new Date();
   try {
      this.result    = this.testFunction.apply(undefined, params);
   }
   catch(err) {
      this.throwError = true;
      this.error      = err;
   }

   if (this.result instanceof Promise) {
      this.result.then(
         function(result) {
            // Note : endDate could be already defined if the "done" function has been triggered
            this.endDate = this.endDate === undefined ? new Date() : this.endDate;
            this.result = result;
            return this.result;
         }.bind(this),
         function(error) {
            this.endDate    = this.endDate === undefined ? new Date() : this.endDate;
            this.throwError = true;
            this.error      = error;
         }.bind(this));
   }
   else
      // Note : endDate could be already defined if the "done" function has been triggered
      this.endDate   = this.endDate === undefined ? new Date() : this.endDate;

   this.context.reset(token, oldInfo);

   return this.result;
};

/**
 * Indicate if the test function (and it's eventual return promises) has finished (true) or not (false)
 * @returns {boolean}
 */
TestExecution.prototype.hasFinished           = function hasFinished() {
   return this.endDate !== undefined;
};

/**
 * Return the duration of the execution.
 * If the test hasn't finished, then return undefined.
 * @param {boolean} [untilNow=false] If true, then if will use the current date instead of the end date if the function hasn'nt finished yet
 * @returns {number|undefined}
 */
TestExecution.prototype.getDuration           = function getDuration(untilNow) {

   var /*** @type {number} */ endDate;

   endDate = this.endDate !== undefined ? this.endDate : (untilNow ? Date.now() : undefined);

   if (endDate === undefined)
      return undefined;

   return endDate - this.startDate;
};

/**
 *
 * @returns {Date}
 */
TestExecution.prototype.getEndDate            = function getEndDate() {
   return this.endDate;
};

/**
 *
 * @returns {Date}
 */
TestExecution.prototype.getStartDate          = function getStartDate() {
   return this.startDate;
};

export default TestExecution;