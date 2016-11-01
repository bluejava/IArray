# IArray

An Immutable Array that looks, behaves (and IS) a standard JavaScript Array but with immutable properties.

---

## Why

One of the cornerstones of functional programming is immutable data structures. Using immutable data structures insures to the author and other programmers that once they have a handle to an object, it won't change beneath their feet. This is important for reasoning about code. It aids with testing, debugging and refactoring. It provides a much faster way to determine if state has changed. And it helps you write pure functions.

Arrays are an extremely popular data structure in most JavaScript programs. But they are far from immutable. One can simply assign values to an array at a given index via `myArray[10] = 100`. And many of the Array methods are mutating, such as `push`, `sort` and `slice`.

Some libraries exist that provide random access data structures similar to the Array but that are immutable, such as [Mori](http://swannodette.github.io/mori/) or [Immutable](https://facebook.github.io/immutable-js/) - but they are large opinionated libraries that expose a completely different API.

**IArray** provides an Immutable array only, and is very light. 

```bash
wc -l IArray.js 
119 IArray.js
```

119 lines in the *source* file, much of which is comments and the universal module definition. 

## How

`IArray` extends the `Array` object by building a prototype which includes `Array.prototype`. This enables `IArray` to offer all the API methods contained in the standard `Array`, and appear to debuggers and most other type checkers as an `Array`

```javascript
const a = IArray()
if(a instanceof Array) // true!
// ...
```

But `IArray` intercepts calls to mutating methods, such as `push` and internally clones the array, calls the `Array.push` using your same arguments, and finally returning a new `IArray` with the result.

So mutating methods all exist, but their behavior is slightly different - returning a new `IArray` with the changes applied, rather than mutating the array upon which its called.

In cases where a method mutated the underlying array and also returned a value (such as `pop`), the value is available at `IArray.ret`.

## API

Since this extends the standard JavaScript `Array`, I will only document the methods that have *changed* from the standard Array API:


### `concat(value1[, value2 ...]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) `Array.concat` with the exception that the returned array is an `IArray`.

```javascript
IArray([1, 2, 3]).concat([7, 8]) // => IArray([1, 2, 3, 7, 8])
IArray().concat(IArray([3, 4, 5]) // => IArray([3, 4, 5])
IArray([1, 2, 3]).concat(100) // => IArray([1, 2, 3, 100])
```


### `copyWithin(target[, start[, end]]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin) `Array.copyWithin` with the exception that the returned array is an `IArray` and the original array is not modified

```javascript
var a = IArray([5, 6, 7, 8])
var b = a.copyWithin(2) // => IArray([5, 6, 5, 6]) (a unmodified)
```

### `fill(target[, start[, end]]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill) `Array.fill` with the exception that the returned array is an `IArray`.

```javascript
var a1 = IArray([1, 2, 3, 4, 5])
var a2 = a1.fill(9, 2, 4)
// a1 = IArray([1, 2, 3, 4, 5]) - this shouldn't change
// a2 = IArray([1, 2, 9, 9, 5]) - fill 9s starting at item 2, ending at 4
```

### `filter(fn[, thisArg]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) `Array.filter` with the exception that the returned array is an `IArray`.

```javascript
function even(n) { return n % 2 === 0 }

var a1 = IArray([1, 2, 3, 4, 5, 6])
var a2 = a1.filter(even)
// a1 = IArray([1, 2, 3, 4, 5, 6]) - this shouldn't change
// a2 = IArray([2, 4, 6]) - even values only
```

### `map(fn[, thisArg]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) `Array.map` with the exception that the returned array is an `IArray`.

```javascript
var a1 = IArray([1, 4, 9, 25])
var a2 = a1.map(Math.sqrt)
// a1 = IArray([1, 4, 9, 25]) - ensure it is unchanged
// a2 = IArray([1, 2, 3, 5]) - mapped values
```

### `push(value1, ..., valuen) => IArray`

The same API signature as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) `Array.push`, but the original `IArray` is not modified. A new `IArray` is returned with the value(s) appended, and the length property is stored in the `ret` property (which is mostly redundant since it is also available in the `length` property - but is included for consistency)

```javascript
var a1 = IArray([1, 4, 9])
var a2 = a1.push(100)
// a1 = IArray([1, 4, 9])
// a2 = IArray([1, 4, 9, 100])
```

### `pop() => IArray`

The same API signature as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) `Array.pop`, but the original `IArray` is not modified. A new `IArray` is returned with the last value removed, and the value that was removed is stored in the `ret` property.

```javascript
var a1 = IArray([1, 4, 9])
var a2 = a1.pop()
// a1 = IArray([1, 4, 9])	- unchanged
// a2 = IArray([1, 4])		- same as a1 with last element removed
// a2.ret = 9				- last element stored in ret property
```

### `shift() => IArray`

The same API signature as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) `Array.shift`, but the original `IArray` is not modified. A new `IArray` is returned with the first element removed. This removed element is available through the `ret` property of the returned `IArray`.

```javascript
var a1 = IArray([1, 4, 9])
var a2 = a1.shift()

// a1 = IArray([1, 4, 9])	- no change
// a2 = IArray([4, 9])		- first value removed
// a2.ret = 1 				- removed value
```

### `slice([begin[, end]]) => IArray`

Behaves just as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) `Array.slice` with the exception that the returned array is an `IArray`.

```javascript
var a1 = IArray([5, 10, 15, 20])
var a2 = a1.slice(1, 3)
// a1 = IArray([5, 10, 15, 20])) - no changes
// a2 = IArray([10, 15])) - elements 1 to 3 (non-inclusive)
```

### `sort([compareFn]) => IArray`

Behaves just like the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) `Array.sort` with the exception that the original `IArray` is not modified, and the newly sorted `IArray` is returned.

```javascript
var fruit = ["cherries", "apples", "bananas", "pears"]
var a1 = IArray(fruit)
var a2 = a1.sort()
var a3 = a1.sort(function(a, b) { return a.length - b.length }) // sort by word length
// a1 remains unchanged: IArray(["cherries", "apples", "bananas", "pears"])
// a2 is sorted: IArray(["apples", "bananas", "cherries", "pears"])
// a3 is sorted according to comparitor: IArray(["pears", "apples", "bananas", "cherries"])
```

### `splice([start[, deleteCount[, value1, value2, ...]]]) => IArray`

Behaves just like the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) `Array.splice` with the exception that the original `IArray` is not modified but is returned as a new `IArray`. The removed items will be stored as an `IArray` on the `ret` property.

```javascript
var a1 = IArray([5, 10, 15, 20])
var a2 = a1.splice(1, 1, 22)
// a1 is unchanged
// a2 is IArray([5, 22, 15, 20]) - item 1 removed and replaced with 22
// a2.ret is IArray([10]) - the removed items in an IArray
```


### `unshift([element1, ..., elementN]) => IArray`

The same API signature as the [standard](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) `Array.unshift`, but the original `IArray` is not modified. A new `IArray` is returned with elements added to the front of the array.

```javascript
var a1 = IArray([5, 10, 20])
var a2 = a1.unshift("hello", "world")

// a1 = IArray([5, 10, 20])) - unchanged
// a2 = IArray(["hello", "world", 5, 10, 20]))
```



### License

See the LICENSE file for license rights and limitations (MIT).