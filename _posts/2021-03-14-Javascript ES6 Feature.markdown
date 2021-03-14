---

title:  "Javascript ES6 Feature"
date:   2021-03-13 12:29:23 +0800
categories: 
 - Front-end 
 - Note 
 - Javascript
toc: true
---


# Javascript ES6 New Feature

## Variables
1. Support for constants.\
   `const pi = 3.14`\
   Note, it only makes variable itself immutable, not it's assigned content.

2. Block-Scoped Variables
   `let`

  
## Arrow Functions
1. More expressive closure syntax.
2. More intuitive handling of current object context
   ```js
   //ES6
    var obj = {
        count : 10,
        doSomethingLater : function(){ // of course, arrow functions 
        //are not suited for methods
            setTimeout( () => { // since the arrow function was created
            // within the "obj", it assumes the object's "this"
                this.count++;
                console.log(this.count);
            }, 300);
        }
    }

    obj.doSomethingLater();
   //ES5
   var obj = {
      count : 10,
      doSomethingLater : function (){
          setTimeout(function(){ // the function executes on the window scope
              this.count++;
              console.log(this.count);
          }, 300);
      }
    }
    obj.doSomethingLater(); // console prints "NaN", 
    //because the property "count" is not in the window scope.

   ```
    
   More on the bindig of `this`:
   1. **By default**, `this` points to the `window` object
   2. **Implicit binding**: if the function is called by the object (AKA method call), `this` will point to the object
   3. **Explicit binding**: using `call`, `apply`, `bind`
   4. **`new` binding**: when calling the function with `new`, `this` will point to the object that the function returns.
   5. For the **arrow function**: it doesn't have `this`, so it needs to look up the *scope chain* to make sure what `this` points at. It means if the arrow function is inside a non-arrow function, `this` will be bind to the closest non-arrow function's `this`. That's why in `forEach` method above, we don't need to specify `this`
      
    Also, arrow functions do not have their own `arguments` object. Non-arrow function has implicit arguments binding (`arguments` is an false array that contains its arguments).

    Therefore, there are several senarios that arrow functions don't apply:
    * Use as constructor (no proper `new` binding)
    * Use `call`, `apply`, `bind`
    * Use as methods (no binding to the object, but to the window)
    * Use of `arguments`
      
    ```js
     var a = {
      nums: [1,2,3,4,5,6,6,5],
      b : function(){
          this.nums.forEach((v) => {
          if (v % 5 === 0)
              this.fives.push(v)
          })
        },
      fives: []
    }
    a.b()
    a.fives //[5,5]
    ```
  ## Extended Parameter Handling
  1. Default Parameter
  
      ```js
      function f(x, y = 7, z = 42){
          return x+y+z;
      }
      ```
      
  2. Rest Parameter
      ```js
      function f (x, y, ...a) {
        return (x + y) * a.length
        }
        f(1, 2, "hello", true, 7) === 9

        ```

  3. Spread Operator

        ```js
        var params = [ "hello", true, 7 ]
        var other = [ 1, 2, ...params ] // [ 1, 2, "hello", true, 7 ]

        function f (x, y, ...a) {
            return (x + y) * a.length
        }
        f(1, 2, ...params) === 9

        var str = "foo"
        var chars = [ ...str ] // [ "f", "o", "o" ]
        ```

  ## Template Literals
  1. String Interpolation
      ```js
      var customer = { name: "Foo" }
      var card = { amount: 7, product: "Bar", unitprice: 42 }
      var message = `Hello ${customer.name},
      want to buy ${card.amount} ${card.product} for
      a total of ${card.amount * card.unitprice} bucks?`
      ```
  2. Custom Interpolation

      ```js
      get`http://example.com/foo?bar=${bar + baz}&quux=${quux}`
      ```
  3. Raw String Access


  ## Extended Literals
  1. Binary & Octal Literals
      ```js
      0b111110111 === 503
      0o767 === 503
      ```
  
  ## Enhanced Object Properties
   1. Property Shorthand
      ```js
      var x = 0, y = 0
      obj = { x, y }
      ```

  ## Destructuring Assignment
   1. Array Matching
  
      ```js
      var list = [ 1, 2, 3 ]
      var [ a, , b ] = list
      [b, a ] = [ a, b ]
      ```

  ## Modules
  1. Value Export/Import
        ```js
      //  lib/math.js
      export function sum (x, y) { return x + y }
      export var pi = 3.141593

      //  someApp.js
      import * as math from "lib/math"
      console.log("2π = " + math.sum(math.pi, math.pi))

      //  otherApp.js
      import { sum, pi } from "lib/math"
      console.log("2π = " + sum(pi, pi))
        ```

  ## Class Definition

  ## Symbol Type

  ## Iterators

  ## Map/Set

  ## Promise