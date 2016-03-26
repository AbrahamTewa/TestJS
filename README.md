# TestJS

TestJS is a javscript testing framework :

* Simplicity
* Synchronous and asynchronous tests
* Lisibility

### Usage
#### Into browser
Add to HTML file :

``` html
<head>
   <link type="text/css" rel="stylesheet" href="test-js.css"  media="screen,projection"/>
   <script src="test-js.js"></script>
   <script>
    // example of tests :
      test('This is a successful test', true);

    // Displaying test result
    test.display()
   </script>
</head>
```

#### Into console
``` javascript
var test = require('test-js');

// example of tests :
test('This is a successful test', true);

// Displaying test result
test.console();
```

### Full example

```javascript
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

test.note('To display test, call the "display" method');
```
