'use strict';

/**
 * Testing the function "isTrue"
 *
 * We test "manually" here the isTrue function.
 * The purpose is to be sure that this function is working correctly to use it for other testes.
 *
 * After that, we will be able to make testes as
 *    test('<undefined>.isUndefined', test("otherTitle", undefined).isUndefined().result).isTrue()
 *
 */

function testAll() {

   var expectedErrors, testAll;
   expectedErrors = 0;

   testAll = {};

   testAll['successful test'] = test('successful test', true).describe('This test should pass').getResult() === true;
   testAll['failed test']     = test('failed test', false).describe('This test should fail').getResult() === false;

   test('failed group', function() {

      var testPromise;

      test('successful test', true);
      test('failed test'    , false);

      test('successful group', function() {}).then('successful test', function() {return true});

      testPromise = test('failed group', function() {});

      testPromise.then('successful test', function() {return true});
      testPromise.then('failed test', function() {return false});

      test('successful group', function() {
         test('successful test', true);
      });

   });


   test('tests', function() {
      test('unitTest', function() {
         var /** @type {function} */ noStrict
           , /** @type {boolean}  */ not
           , /** @type {number}   */ results
           , /** @type {function} */ strict
           , /** @type {Object}   */ unitTest;

         unitTest = {not: {}, normal: {}};
         testAll.unitTest = unitTest;

         noStrict   = function noStrict() {

            results = {};

            if (not)
               unitTest['not']['not strict']    = results;
            else
               unitTest['normal']['not strict'] = results;

            test('noTestTypes', function() {

               results['noTestTypes'] = {};

               function makeTest(name, value, result) {
                  results['noTestTypes'][name] = test(name + ' -> ' + (result ? 'success' : 'fail'), value).getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , true );
               makeTest('[]'       , []       , true );
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , true );
               makeTest('Infinity' , Infinity , true );

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , true );
            });

            test('isTrue', function() {
               results['isTrue'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isTrue'][name] = test(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isTrue().getResult() === !result;
                  else
                     results['isTrue'][name] = test(name + ' -> ' + (result ? 'success' : 'fail'), value).isTrue().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , true );
               makeTest('[]'       , []       , true );
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , true );
               makeTest('Infinity' , Infinity , true );

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , true );
            });

            test('isFalse', function() {
               results['isFalse'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isFalse'][name] = test(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isFalse().getResult() === !result;
                  else
                     results['isFalse'][name] = test(name + ' -> ' + (result ? 'success' : 'fail'), value).isFalse().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , false);
               makeTest('false'    , false    , true );

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , true );

               // Numbers
               makeTest('0'        , 0        , true );
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, true );
               makeTest('null'     , null     , true );
               makeTest('NaN'      , {}       , false);
            });

            test('isUndefined', function() {
               results['isUndefined'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isUndefined'][name] = test(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isUndefined().getResult() === !result;
                  else
                     results['isUndefined'][name] = test(name + ' -> ' + (result ? 'success' : 'fail'), value).isUndefined().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , false);
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, true );
               makeTest('null'     , null     , true );
               makeTest('NaN'      , {}       , false);
            });

            test('isDefined', function() {
               results['isDefined'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isDefined'][name] = test(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isDefined().getResult() === !result;
                  else
                     results['isDefined'][name] = test(name + ' -> ' + (result ? 'success' : 'fail'), value).isDefined().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , true );

               // Empty objects
               makeTest('{}'       , {}       , true );
               makeTest('[]'       , []       , true );
               makeTest('\'\''     , ''       , true );

               // Numbers
               makeTest('0'        , 0        , true );
               makeTest('1'        , 1        , true );
               makeTest('Infinity' , Infinity , true );

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , true );
            });

            test('equal', function() {

               var /** @type {number}   */ a
                 , /** @type {Array}    */ array
                 , /** @type {Object}   */ object
                 , /** @type {Array}    */ values
                 , /** @type {string[]} */ valuesString;

               results['equal'] = {};

               function makeTest(name1, name2, value1, value2) {

                  var /** @type {boolean} */ result;

                  result = value1 == value2;

                  if (results['equal'][name1] === undefined)
                     results['equal'][name1] = {};

                  if (not)
                     results['equal'][name1][name2] = test(name2 + ' -> ' + (!result ? 'success' : 'fail'), value1).not.equal(value2).getResult() === !result;
                  else
                     results['equal'][name1][name2] = test(name2 + ' -> ' + (result ? 'success' : 'fail'), value1).equal(value2).getResult() === result;
               }

               object = {};
               array  = [];

               values       = [ 0 ,  1 ,  2 ,  Infinity ,  true ,  false ,  [] ,  {} ,  object ,  array ,   ''  ,  undefined ,  null ];
               valuesString = ['0', '1', '2', 'Infinity', 'true', 'false', '[]', '{}', 'object', 'array', '\'\'', 'undefined', 'null'];

               for(a in values) {

                  test(valuesString[a], function() {

                     var /** @type {number} */ b;

                     for(b in values) {
                        makeTest(valuesString[a], valuesString[b], values[a], values[b]);
                     }
                  });
               }
            });

            test('isDifferentThan', function() {

               var /** @type {number}   */ a
                 , /** @type {Array}    */ array
                 , /** @type {Object}   */ object
                 , /** @type {Array}    */ values
                 , /** @type {string[]} */ valuesString;

               results['isDifferentThan'] = {};

               function makeTest(name1, name2, value1, value2) {

                  var /** @type {boolean} */ result;

                  result = value1 != value2;

                  if (results['isDifferentThan'][name1] === undefined)
                     results['isDifferentThan'][name1] = {};

                  if (not)
                     results['isDifferentThan'][name1][name2] = test(name2 + ' -> ' + (!result ? 'success' : 'fail'), value1).not.isDifferentThan(value2).getResult() === !result;
                  else
                     results['isDifferentThan'][name1][name2] = test(name2 + ' -> ' + (result ? 'success' : 'fail'), value1).isDifferentThan(value2).getResult() === result;
               }

               object = {};
               array  = [];

               values       = [ 0 ,  1 ,  2 ,  Infinity ,  true ,  false ,  [] ,  {} ,  object ,  array ,   ''  ,  undefined ,  null ];
               valuesString = ['0', '1', '2', 'Infinity', 'true', 'false', '[]', '{}', 'object', 'array', '\'\'', 'undefined', 'null'];

               for(a in values) {

                  test(valuesString[a], function() {

                     var /** @type {number} */ b;

                     for(b in values) {
                        makeTest(valuesString[a], valuesString[b], values[a], values[b]);
                     }
                  });
               }
            });
         };

         strict     = function strict () {

            results = {};

            if (not)
               unitTest['not']['strict']    = results;
            else
               unitTest['normal']['strict'] = results;

            test('noTestTypes'    , function() {

               results['noTestTypes'] = {};

               function makeTest(name, value, result) {
                  results['noTestTypes'][name] = test.strict(name + ' -> ' + (result ? 'success' : 'fail'), value).getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , false);
            });

            test('isTrue'         , function() {
               results['isTrue'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isTrue'][name] = test.strict(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isTrue().getResult() === !result;
                  else
                     results['isTrue'][name] = test.strict(name + ' -> ' + (result ? 'success' : 'fail'), value).isTrue().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , false);
            });

            test('isFalse'        , function() {
               results['isFalse'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isFalse'][name] = test.strict(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isFalse().getResult() === !result;
                  else
                     results['isFalse'][name] = test.strict(name + ' -> ' + (result ? 'success' : 'fail'), value).isFalse().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , false);
               makeTest('false'    , false    , true );

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , false);
            });

            test('isUndefined'    , function() {
               results['isUndefined'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isUndefined'][name] = test.strict(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isUndefined().getResult() === !result;
                  else
                     results['isUndefined'][name] = test.strict(name + ' -> ' + (result ? 'success' : 'fail'), value).isUndefined().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , false);
               makeTest('false'    , false    , false);

               // Empty objects
               makeTest('{}'       , {}       , false);
               makeTest('[]'       , []       , false);
               makeTest('\'\''     , ''       , false);

               // Numbers
               makeTest('0'        , 0        , false);
               makeTest('1'        , 1        , false);
               makeTest('Infinity' , Infinity , false);

               // Special values
               makeTest('undefined', undefined, true );
               makeTest('null'     , null     , false);
               makeTest('NaN'      , {}       , false);
            });

            test('isDefined'      , function() {
               results['isDefined'] = {};

               function makeTest(name, value, result) {
                  if (not)
                     results['isDefined'][name] = test.strict(name + ' -> ' + (!result ? 'success' : 'fail'), value).not.isDefined().getResult() === !result;
                  else
                     results['isDefined'][name] = test.strict(name + ' -> ' + (result ? 'success' : 'fail'), value).isDefined().getResult() === result;
               }

               // Booleans
               makeTest('true'     , true     , true );
               makeTest('false'    , false    , true );

               // Empty objects
               makeTest('{}'       , {}       , true );
               makeTest('[]'       , []       , true );
               makeTest('\'\''     , ''       , true );

               // Numbers
               makeTest('0'        , 0        , true );
               makeTest('1'        , 1        , true );
               makeTest('Infinity' , Infinity , true );

               // Special values
               makeTest('undefined', undefined, false);
               makeTest('null'     , null     , true );
               makeTest('NaN'      , {}       , true );
            });

            test('equal'          , function() {

               var /** @type {number}   */ a
                 , /** @type {Array}    */ array
                 , /** @type {Object}   */ object
                 , /** @type {Array}    */ values
                 , /** @type {string[]} */ valuesString;

               results['equal'] = {};

               function makeTest(name1, name2, value1, value2) {

                  var /** @type {boolean} */ result;

                  result = value1 === value2;

                  if (results['equal'][name1] === undefined)
                     results['equal'][name1] = {};

                  if (not)
                     results['equal'][name1][name2] = test.strict(name2 + ' -> ' + (!result ? 'success' : 'fail'), value1).not.equal(value2).getResult() === !result;
                  else
                     results['equal'][name1][name2] = test.strict(name2 + ' -> ' + (result ? 'success' : 'fail'), value1).equal(value2).getResult() === result;
               }

               object = {};
               array  = [];

               values       = [0, 1, 2, Infinity, true, false, [], {}, object, array, '', undefined, null];
               valuesString = ['0', '1', '2', 'Infinity', 'true', 'false', '[]', '{}', 'object', 'array', '\'\'', 'undefined', 'null'];

               for(a in values) {

                  test(valuesString[a], function() {
                     var /** @type {number} */ b;
                     for(b in values) {
                        makeTest(valuesString[b], valuesString[b], values[a], values[b]);
                     }
                  });

               }

            });

            test('isDifferentThan', function() {

               var /** @type {number}   */ a
                 , /** @type {Array}    */ array
                 , /** @type {Object}   */ object
                 , /** @type {Array}    */ values
                 , /** @type {string[]} */ valuesString;

               results['isDifferentThan'] = {};

               function makeTest(name1, name2, value1, value2) {

                  var /** @type {boolean} */ result;

                  result = value1 !== value2;

                  if (results['isDifferentThan'][name1] === undefined)
                     results['isDifferentThan'][name1] = {};

                  if (not)
                     results['isDifferentThan'][name1][name2] = test.strict(name2 + ' -> ' + (!result ? 'success' : 'fail'), value1).not.isDifferentThan(value2).getResult() === !result;
                  else
                     results['isDifferentThan'][name1][name2] = test.strict(name2 + ' -> ' + (result ? 'success' : 'fail'), value1).isDifferentThan(value2).getResult() === result;
               }

               object = {};
               array  = [];

               values       = [ 0 ,  1 ,  2 ,  Infinity ,  true ,  false ,  [] ,  {} ,  object ,  array ,   ''  ,  undefined ,  null ];
               valuesString = ['0', '1', '2', 'Infinity', 'true', 'false', '[]', '{}', 'object', 'array', '\'\'', 'undefined', 'null'];

               for(a in values) {

                  test(valuesString[a], function() {

                     var /** @type {number} */ b;

                     for(b in values) {
                        makeTest(valuesString[a], valuesString[b], values[a], values[b]);
                     }
                  });
               }
            });

            test('isBetween'      , function() {

               test('1', 1).isBetween(0, 2);

               test('')

            });

         };

         test('normal', function() {
            not = false;
            test('noStrit', noStrict);
            test('strict', strict);
         });

         test('not', function() {
            not = true;
            test('noStrict', noStrict);
            test('strict', strict);
         });

         test('Function return', function functionResult() {

            results = {};
            unitTest.functionReturn = results;

            test('return true', function() {

               test('normal');

               results['normal - return True'] = test('', function() {
                 return true;
               }).getResult() === true;

               results['normal - return True -> equal(true)'] = test('equal(true)', function() {
                 return true;
               }).equal(true).getResult() === true;

               results['normal - return True -> isFalse'] = test('isFalse', function() {
                 return true;
               }).equal(false).getResult() === false;


               results['normal - return 1'] = test('', function() {
                 return 1;
               }).getResult() === true;

               results['normal - return 1 -> equal(true)'] = test('equal(true)', function() {
                 return 1;
               }).equal(true).getResult() === true;

               results['normal - return 1 -> equal(false)'] = test('equal(false)', function() {
                 return 1;
               }).equal(false).getResult() === false;



               test('strict');

               results['strict - return True'] = test.strict('', function() {
                 return true;
               }).getResult() === true;

               results['strict - return True -> equal(true)'] = test.strict('equal(true)', function() {
                 return true;
               }).equal(true).getResult() === true;

               results['strict - return True -> equal(false)'] = test.strict('equal(false)', function() {
                 return true;
               }).equal(false).getResult() === false;


               results['strict - return 1'] = test.strict('', function() {
                 return 1;
               }).getResult() === false;

               results['strict - return 1 -> equal(true)'] = test.strict('equal(true)', function() {
                 return 1;
               }).equal(true).getResult() === false;

               results['strict - return 1 -> equal(false)'] = test.strict('equal(false)', function() {
                 return 1;
               }).equal(false).getResult() === false;

            });

            test('return false', function() {

               test('normal');

               results['normal - return False'] = test('', function() {
                  return false;
               }).getResult() === false;

               results['normal - return False -> equal(true)'] = test('equal(true)', function() {
                  return false;
               }).equal(true).getResult() === false;

               results['normal - return False -> equal(false)'] = test('equal(false)', function() {
                  return false;
               }).equal(false).getResult() === true;


               results['normal - return 0'] = test('', function() {
                  return 0;
               }).getResult() === false;

               results['normal - return 0 -> equal(true)'] = test('equal(true)', function() {
                  return 0;
               }).equal(true).getResult() === false;

               results['normal - return 0 -> equal(false)'] = test('equal(false)', function() {
                  return 0;
               }).equal(false).getResult() === true;


               test('strict');

               results['strict - return False'] = test.strict('', function() {
                  return false;
               }).getResult() === false;

               results['strict - return False -> equal(true)'] = test.strict('equal(true)', function() {
                  return false;
               }).equal(true).getResult() === false;

               results['strict - return False -> equal(false)'] = test.strict('equal(false)', function() {
                  return false;
               }).equal(false).getResult() === true;


               results['strict - return 0'] = test.strict('', function() {
                  return 0;
               }).getResult() === false;

               results['strict - return 0 -> equal(true)'] = test.strict('equal(true)', function() {
                  return 0;
               }).equal(true).getResult() === false;

               results['strict - return 0 -> equal(false)'] = test.strict('equal(false)', function() {
                  return 0;
               }).equal(false).getResult() === false;

            });

            test('no return');
            results['no return']            = test(''       , function() {}).getResult()           === false;
            results['no return -> isTrue']  = test('isTrue' , function() {}).isTrue().getResult()  === false;
            results['no return -> isFalse'] = test('isFalse', function() {}).isFalse().getResult() === true;
         });
      });

      test('section' , function() {

         var /** @type {Object} */ testExport
           , /** @type {string} */ titleSectionA
           , /** @type {string} */ titleSectionB
           , /** @type {Object} */ results;

         results = {};
         testAll['section']  = {'section A': results};

         titleSectionA = 'section A';
         titleSectionB = 'section B';

         test(titleSectionA);
         results.A1 = test('A1 (success)', true).getResult()  === true;
         results.A2 = test('A2 (success)', true).getResult()  === true;
         results.A3 = test('A3 (fail)'   , false).getResult() === false;

         test('A4 - subgroup - no section', function() {
            results.A4 = {};

            results.A4['1'] = test('A4-1 (fail)'   , false).getResult() === false;
            results.A4['2'] = test('A4-2 (success)', true ).getResult() === true;
            results.A4['3'] = test('A4-3 (success)', true ).getResult() === true;
         });

         test('A5 - subgroup - 2 sections', function() {
            results.A5 = {};

            test('section A');
            results.A5.A1 = test('A5-A1', true ).getResult() === true;
            results.A5.A2 = test('A5-A2', true ).getResult() === true;
            results.A5.A3 = test('A5-A3', false).getResult() === false;

            test('section B');
            results.A5.B1 = test('A5-B1', false).getResult() === false;
            results.A5.B2 = test('A5-B2', false).getResult() === false;
            results.A5.B3 = test('A5-B3', false).getResult() === false;
         });

         test(titleSectionB).describe('all false (3 tests)');
         results.B1 = test('false 1', false).getResult() === false;
         results.B2 = test('false 2', false).getResult() === false;
         results.B3 = test('false 3', false).getResult() === false;

         testExport = test.getData();

         test('section C').describe('testing getData');
         results.C1 = test('getData.sections.length === 2', testExport.sections.length).equal(2).getResult() === true;
         results.C2 = test('getData.sections[0].title equal \'section A\'', testExport.sections[0].title).equal(titleSectionA).getResult() === true;
         results.C3 = test('getData.sections[1].title equal \'section B\'', testExport.sections[1].title).equal(titleSectionB).getResult() === true;
         results.C4 = test('getData.sections[0].tests.length equal 5', testExport.sections[0].tests.length).equal(5).getResult() === true;
         results.C5 = test('getData.sections[1].tests.length equal 3', testExport.sections[1].tests.length).equal(3).getResult() === true;

         results.C6 = test('getData.sections[0].tests[0].sections.length equal 0', testExport.sections[0].tests[0].sections.length).equal(0).getResult() === true;
         results.C6 = test('getData.sections[0].tests[4].sections.length equal 3', testExport.sections[0].tests[4].sections.length).equal(2).getResult() === true;

      });

      test('async'   , function() {
         var /** @type {boolean} */ executedImmediately
           , /** @type {Object} */ results
           , tests;

         results = {};
         testAll['async']  = results;
         tests = {};

         // Return true
         results.returnTrue  = { sync   : false};
         executedImmediately = false;

         tests.returnTrue = test.async('returnTrue', function() {
            results.returnTrue.async = true;
            return true;
         });

         results.returnTrue.result = tests.returnTrue.then(function() {
            return tests.returnTrue.getResult() === true;
         });

         // Checking that the async code hasn't been executed immediately
         results.returnTrue.sync = executedImmediately === false;



         // Return false
         results.returnFalse = { sync   : false };
         executedImmediately = false;

         tests.returnFalse = test.async('returnFalse', function() {
            results.returnFalse.async = true;
            return false;
         });

         results.returnFalse.result = tests.returnTrue.then(function() {
            return tests.returnFalse.getResult() === false;
         });

         // Checking that the async code hasn't been executed immediately
         results.returnFalse.sync = executedImmediately === false;

      });

      test('delay'   , function() {

         var /** @type {Object}        */ results;

         results = {};
         testAll['delay']  = results;

         // Return true
         results['D1 - return true'] = new Promise(function(fullfill) {

            var /** @type {number} */ date;

            date = Date.now();

            test.delay('return true', 5000, function() {
               results['return true'] = Date.now() - date >= 5000;
               fullfill(results['return true']);
               return results['return true'];
            });

         });

      });

      test('API'     , function() {

         testAll['API']  = {};

         test('isSuccessful', function() {
            var /** @type {Object} */ results;

            results = {};
            testAll.API.isSuccessful = results;

            results.returnTrue  = test('return true', true).isSuccessful()   === true;
            results.returnFalse = test('return false', false).isSuccessful() === false;

            test('groups', function() {

               var title;

               results['groups'] = {};

               title = 'invalid';
               results['groups'][title] = test(title, function() {}).isSuccessful() === false;

               title = 'no return - all test true';
               results['groups'][title] = test(title, function() {
                  test('return True', true);
               }).isSuccessful() === true;

               title = 'no return - all test false';
               results['groups'][title] = test(title, function() {
                  test('return False', false);
               }).isSuccessful() === false;


               title = 'return true - all test true';
               results['groups'][title] = test(true, function() {
                  test('return True', true);
                  return true;
               }).isSuccessful() === true;

               title = 'return false - all test true';
               results['groups'][title] = test(true, function() {
                  test('return True', true);
                  return false;
               }).isSuccessful() === false;

               title = 'return true - all test false';
               results['groups'][title] = test(true, function() {
                  test('return False', false);
                  return true;
               }).isSuccessful() === false;

               title = 'return false - all test false';
               results['groups'][title] = test(true, function() {
                  test('return False', false);
                  return false;
               }).isSuccessful() === false;

            });

         });

         test('countFailedTests / countSuccessfulTests / countTotalTests ', function() {
            // TODO : check with async
            var /** @type {function} */ check
              , /** @type {Object} */ results;

            results = {};
            testAll.API.count = results;

            results.returnTrue  = test('return true', true).countFailedTests()   === 0;
            results.returnFalse = test('return false', false).countFailedTests() === 1;

            check = function (resultGroup, title, nbTotal, nbSuccesses, nbFails, testFunction) {

               var localResults, t;

               resultGroup[title] = {};


               // x1
               t = test(title + ' - x1', function() {
                  test('test', testFunction);
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses
                              , countTotalTests      : t.countTotalTests()      === nbTotal};

               resultGroup[title]['x1'] = localResults;



               // x1 - return true
               t = test(title + ' - x1 return true', function() {
                  test('test', testFunction);
                  return true;
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses + 1
                              , countTotalTests      : t.countTotalTests()      === nbTotal +1};

               resultGroup[title]['x1 - return true'] = localResults;



               // x1 - return false
               t = test(title + ' - x1 return false', function() {
                  test('test', testFunction);
                  return false;
               });

               localResults = { successful           : t.isSuccessful()         === false
                              , countFailedTests     : t.countFailedTests()     === nbFails + 1
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses
                              , countTotalTests      : t.countTotalTests()      === nbTotal + 1};

               resultGroup[title]['x1 - return false'] = localResults;

               // x3
               t = test(title + ' - x3', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails     * 3
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 3
                              , countTotalTests      : t.countTotalTests()      === nbTotal     * 3};

               resultGroup[title]['x3'] = localResults;

               // x3 return true
               t = test(title + ' - x3 return true', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);
                  return true
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails * 3
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 3 + 1
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 3 + 1};

               resultGroup[title]['x3 return true'] = localResults;

               // x3 return false
               t = test(title + ' - x3 return false', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);
                  return false
               });

               localResults = { successful           : t.isSuccessful()         === false
                              , countFailedTests     : t.countFailedTests()     === nbFails * 3 + 1
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 3
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 3 + 1};

               resultGroup[title]['x3 - return false'] = localResults;

               // x3 + section x1
               t = test(title + ' - x3 - section x1', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);

                  test('section 1');
                  test('4', testFunction);
                  test('5', testFunction);
                  test('6', testFunction);
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails * 6
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 6
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 6};

               resultGroup[title]['x3 - section x1'] = localResults;

               // x3 + section x1 + return true
               t = test(title + ' - x3 - section x1 - return true', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);

                  test('section 1');
                  test('4', testFunction);
                  test('5', testFunction);
                  test('6', testFunction);

                  return true;
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails * 6
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 6 + 1
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 6 + 1};

               resultGroup[title]['x3 - section x1 - return true'] = localResults;

               // x3 + section x1 + return false
               t = test(title + ' - x3 - section x1 - return false', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);

                  test('section 1');
                  test('4', testFunction);
                  test('5', testFunction);
                  test('6', testFunction);

                  return false;
               });

               localResults = { successful           : t.isSuccessful()         === false
                              , countFailedTests     : t.countFailedTests()     === nbFails * 6 + 1
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 6
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 6 + 1};

               resultGroup[title]['x3 - section x1 - return false'] = localResults;

               // x3 + section x3
               t = test(title + ' - x3 - section x1', function() {
                  test('1', testFunction);
                  test('2', testFunction);
                  test('3', testFunction);

                  test('section 1');
                  test('4', testFunction);
                  test('5', testFunction);
                  test('6', testFunction);

                  test('section 2');
                  test('7', testFunction);
                  test('8', testFunction);
                  test('9', testFunction);

                  test('section 3');
                  test('10', testFunction);
                  test('11', testFunction);
                  test('12', testFunction);
               });

               localResults = { successful           : t.isSuccessful()         === (nbFails === 0)
                              , countFailedTests     : t.countFailedTests()     === nbFails * 12
                              , countSuccessfulTests : t.countSuccessfulTests() === nbSuccesses * 12
                              , countTotalTests      : t.countTotalTests()      === nbTotal * 12};

               resultGroup[title]['x3 - section x1'] = localResults;

            };

            test('groups', function() {
               var localResults;

               localResults = {};
               results['groups'] = localResults;

               check(localResults, 'invalid', 0, 0, 1, function() {});

               check(localResults, 'return true', 1, 1, 0,
                  function() {
                     return true;
                  }
               );

               check(localResults, 'return false', 1, 0, 1,
                  function() {
                     return false;
                  }
               );

               check(localResults, 'true/true/true', 3, 3, 0,
                  function() {
                     test('return true', true);
                     test('return true', true);
                     test('return true', true);
                  }
               );

               check(localResults, 'false/true/true', 3, 2, 1,
                  function() {
                     test('return false', false);
                     test('return true' , true );
                     test('return true' , true );
                  }
               );

               check(localResults, 'false/false/false', 3, 0, 3,
                  function() {
                     test('false', false);
                     test('false', false);
                     test('false', false);
                  }
               );


               check(localResults, '[true]/[true, true, true]/true', 5, 5, 0,
                  function() {
                     test('[1x true]', function() {
                        test('true', true);
                     });

                     test('[3x true]', function() {
                        test('true', true);
                        test('true', true);
                        test('true', true);
                     });

                     test('true', true);
                  }
               );

               check(localResults, '[false]/[true, true, true]/true', 5, 4, 1,
                  function() {
                     test('[1x false]', function() {
                        test('false', false);
                     });

                     test('[3x true]', function() {
                        test('true', true);
                        test('true', true);
                        test('true', true);
                     });

                     test('true', true);
                  }
               );

               check(localResults, '[true]/[false, true, true]/true', 5, 4, 1,
                  function() {
                     test('[1x true]', function() {
                        test('true', true);
                     });

                     test('[true/true/false]', function() {
                        test('true', true);
                        test('true', true);
                        test('false', false);
                     });

                     test('true', true);
                  }
               );

               check(localResults, '[true]/[true, true, true]/false', 5, 4, 1,
                  function() {
                     test('[1x true]', function() {
                        test('true', true);
                     });

                     test('[true/true/true]', function() {
                        test('true', true);
                        test('true', true);
                        test('true', true);
                     });

                     test('false', false);
                  }
               );

               check(localResults, '[false]/[true, true, true]/false', 5, 3, 2,
                  function() {
                     test('[1x false]', function() {
                        test('false', false);
                     });

                     test('[true/true/true]', function() {
                        test('true', true);
                        test('true', true);
                        test('true', true);
                     });

                     test('false', false);
                  }
               );
            });
         });

         test('countErrors', function() {
            var /** @type {Object} */ results;

            results = [];
            testAll['API']['countErrors'] = results;

            results['no group / return true'] = test('no group / return true', function() {
               return true;
            }).countErrors() === 0;

            results['no group / return false'] = test('no group / return false', function() {
               return false;
            }).countErrors() === 0;

            results['no group / throw true'] = test('no group / throw true', function() {
               throw true;
            }).countErrors() === 1;

            expectedErrors++;
            results['no group / throw false'] = test('no group / throw false', function() {
               throw true;
            }).countErrors() === 1;

            expectedErrors++;
            results['no group / throw false'] = test('no group / throw false', function() {
               throw false;
            }).countErrors() === 1;

         });

         test('then', function() {

            var thenResults, token;

            thenResults = {};
            testAll['API']['then'] = thenResults;

            token = {};

            // Async tests
            token['async test'] = 0;

            thenResults['async test'] = test('async test', function() {
            }).then('result', function(test) {
               return token['async test'] === 1;
            });

            token['async test'] = 1;

         });

      });
   });

   test('README.md', function() {



test('This is a successful test', true);
test('This is another successful test', '1').equal(1);
test.strict('This is not a successful test', '1').equal(1);
test.strict('This is successful test', 1).equal(1);

test.comment('You can add comments');
test.comment('Several comments');

test.todo('You can also add one (or several) TODO');

test.describe ('You can add a description');

test.note('You can also add notes');

// Section
test('This is a section because there is no second argument');

test('Sections will group tests', 1).equal(1); // OK
test('Useful when you have many tests in the same level', 15).not.isGreaterOrEqualThan(16); // Successful test
test('Section can\'t be nested', {}).isInstanceOf(Object);
test('For nesting, use group', true);



// Section
test('Groups');

test('Test can execute function', function() {
   return 5;
}).equal(5);

test('If the function contain tests, then it will create a group', function() {

    test('This is a test inside the group test', true).isFalse(); // Failed test

    test('Group can be nested', function() {
       test('Deeper in the group', 3.1415).equal(Math.PI); // Failed test
    });

    test('Group can also return a value : if so, the value will be tested like a regular test', function() {
        test('failed test', false).isTrue();
        return true;
    }); // Test passed, but the group still contain one error

});

test('Async testing');

test.async('This is an async test', function(test) {
    test('In async test, you should use the "test" object provided as parameter', true);

    test.async('Async test can also contain async test', function() {
       return true;
    });
});

test.async('"test" implement the Promise interface', function(test) {
    test('This means that you can call the "then" and "catch" function', true).isTrue();
    return 5;
}).then(function(value) {
    console.log('This function will return a regular Promise');
});

test.async('You can also continue testing inside the "then" function', function() {
    test('But for that, you should provide a string as first argument and a function as second', 'test').contains('s');
    return 5
}).then('The string will be used as the title of the test', function(test, value) {
   test('You will notice that in this case, the first argument is the "test" function', value).isDifferentThan(6);
}).then('You can chain the "then", as for regular promise', function() {
   console.log('Then do not have to contain test, but it should be followed by a next function');
   console.log('otherwise it will be considered as invalid');
}).then('Catch function is not yet implemented but it will come soon', function() {
    return true;
});

test('Promise');
test('TestJS handle promises', new Promise(function(fullfill) {
    fullfill();
})).then('Continuing after promise', function(test) {
    test('You can still return promise', test instanceof Function);

    return Promise.resolve();
}).then('It will continue after the returned promise has finished', function() {return true});



   });

   function checkResults(results) {

      var r;

      for(r in results) {
         if (typeof(results[r]) === 'object' && !(results[r] instanceof Promise || results[r] instanceof test.constructors.Test)) {

            test(r, function() {
               checkResults(results[this.r]);
            }.bind({r:r}));
         }
         else
            test(r, results[r]);

      }
   }

   var resultTest = test('results', function() {
      checkResults(testAll);
   }).describe('This section is the results of all the tests : It should be successful');

   resultTest.todo('Test');
   resultTest.todo('Another test');
   resultTest.comment('A comment');

   console.log(test.getData());
}