
# sandbox

  sandboxing modules, ala YUI

## Installation

    $ component install threepointone/sandbox

## API
```js



// add modules to the sanbox registry with `.add()`

// add module 'aye'
sandbox.add('aye', function($) {
    // `$` is the sandbox instance. to export, add to it.

    $.a = function() {
        console.log('a!');
    };

});

// add another module 'bee', which depends on module 'aye'
sandbox.add('bee', function($) {

    $.b = function() {
        $.a();
        console.log('b!');
    };

},{
    // declare dependecies here
    uses: ['aye']
});

// use it by first instantiating an instance of the sandbox
var s = sandbox();
// and then using whichever modules you'd like to
s.use('bee', function($){    
    $.b();
});

// or like yui
sandbox().use('bee', function($){    
    $.b();
});

// this will output - 

// a!
// b!

```


## Tests 

Install dependencies with 
```
npm install
```
then run
```
npm test
```


## License

  MIT
