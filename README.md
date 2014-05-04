# ascii-math

This is an implimentation of [asciimath](http://www1.chapman.edu/~jipsen/mathml/asciimath.html).  It lets you write plain text maths and have it be nicely formatted for you before display.  Since it's a server side sollution it offers a much nicer user experience than MathJax or the original asciimath did.  You can also use this function on the client if you prefer.

## Installation

    $ npm install ascii-math

## Server side usage

On the server you can generate text that can be placed inline straight into an html document.

```javascript
var parse = require('ascii-math');

var res = parse('e^(i pi)=-1').toString();
// => "<math title="e^(i pi)=-1"><msup><mi>e</mi><mrow><mi>i</mi><mi>&pi;</mi></mrow></msup><mo>=</mo><mo>-</mo><mn>1</mn></math>"
```

## Client side usage

On the client it is recommended that you use `.toElement()` but `.toString()` still works.  You should use it via browserify.

```javascript
var parse = require('ascii-math');

var resA = parse('e^(i pi)=-1').toString();
// => "<math title="e^(i pi)=-1"><msup><mi>e</mi><mrow><mi>i</mi><mi>&pi;</mi></mrow></msup><mo>=</mo><mo>-</mo><mn>1</mn></math>"
div.innerHTML = resA;

var resB = parse('e^(i pi)=-1').toElement();//this method fails on the server
// => <math title="e^(i pi)=-1"><msup><mi>e</mi><mrow><mi>i</mi><mi>&pi;</mi></mrow></msup><mo>=</mo><mo>-</mo><mn>1</mn></math>
div.appendChild(resB);
```