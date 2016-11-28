/* global section, test, assert  */

(function(global, factory) {
    if(typeof define === "function" && define.amd) // eslint-disable-line no-undef
        define(["../IArray"], factory) // eslint-disable-line no-undef
    else if(typeof exports === "object")
        module.exports = factory(require("../IArray.js"))
    else
        throw Error("No module loader found")

    }(this, function(IArray) {

		function testFullArrayAPI()
		{
			test("construction and identification", function() {

					var a = IArray()
					assert(a !== null)
					assert(a instanceof Array)
					assert.equal(a.constructor.name, "Array")
					assert.equal(a.constructor, Array)

				})

			section("concat", function() {

					test("concat with non-arrays", function() {

							var a1 = IArray([1, 2, 3])
							var a2 = a1.concat("test")
							assert.deepEqual(a2, IArray([1, 2, 3, "test"]))

							var a3 = a1.concat(4, "hello") // concat multiple native values
							assert.deepEqual(a3, IArray([1, 2, 3, 4, "hello"]))

							// some edge cases
							assert.deepEqual(a1.concat(), a1)
							assert.deepEqual(a1.concat(null), IArray([1, 2, 3, null]))
							assert.deepEqual(a1.concat(undefined), IArray([1, 2, 3, undefined]))
							assert.deepEqual(a1.concat(false), IArray([1, 2, 3, false]))
						})

					test("concat with arrays", function() {

							var a1 = IArray([1, 2, 3])
							var a2 = [5, 6, 7]
							var a3 = a1.concat(a2)
							assert.deepEqual(a3, IArray([1, 2, 3, 5, 6, 7]))

							var a4 = a1.concat(["hello", "world"], [6, 7])
							assert.deepEqual(a4, IArray([1, 2, 3, "hello", "world", 6, 7]))

							assert.deepEqual(a1.concat([]), a1)
							assert.deepEqual(a1.concat([null]), IArray([1, 2, 3, null]))
							assert.deepEqual(a1.concat([undefined]), IArray([1, 2, 3, undefined]))
						})

					test("concat with IArrays", function() {

							var a1 = IArray([1, 2, 3])
							var a2 = [5, 6, 7]
							var a3 = a1.concat(a2)
							assert.deepEqual(a3, IArray([1, 2, 3, 5, 6, 7]))

							var a4 = a1.concat(IArray([5, 6]), IArray(["hello", "world"]))
							assert.deepEqual(a4, IArray([1, 2, 3, 5, 6, "hello", "world"]))
						})
				}) // END of section("concat", function() {

			section("copyWithin", function() {

					test("target only", function() {

							var a1 = IArray([5, 6, 7, 8])
							var a2 = a1.copyWithin(2)
							assert.deepEqual(a1, IArray([5, 6, 7, 8])) // this shouldn't change
							assert.deepEqual(a2.toArray(), [5, 6, 5, 6]) // result array

							var a3 = IArray([1, 2, 3, 4, 5]).copyWithin(-2) // test with negative target
							assert.deepEqual(a3.toArray(), [1, 2, 3, 1, 2])

						})

					test("target and start", function() {

							var a1 = IArray([1, 2, 3, 4, 5])
							var a2 = a1.copyWithin(0, 3)
							assert.deepEqual(a1, IArray([1, 2, 3, 4, 5])) // this shouldn't change
							assert.deepEqual(a2.toArray(), [4, 5, 3, 4, 5]) // result array

						})

					test("target, start and end", function() {

							var a1 = IArray([1, 2, 3, 4, 5])
							var a2 = a1.copyWithin(0, 3, 4)
							assert.deepEqual(a2.toArray(), [4, 2, 3, 4, 5])

							var a3 = IArray([1, 2, 3, 4, 5]).copyWithin(-2, -3, -1)
							assert.deepEqual(a3.toArray(), [1, 2, 3, 3, 4])

						})

				}) // END of section("copyWithin")

			test("every", function() {

				// Returns true if value passed is greater than 10
				function g10(n) { return n > 10 }

				assert(IArray([12, 15, 20, 102]).every(g10))
				assert(!IArray([12, 15, 20, 6]).every(g10))

			})

			section("fill", function() {

					test("Single value argument", function() {

						var a1 = IArray([1, 2, 3, 4, 5])
						var a2 = a1.fill(7)
						assert.deepEqual(a1, IArray([1, 2, 3, 4, 5])) // this shouldn't change
						assert.deepEqual(a2.toArray(), [7, 7, 7, 7, 7]) // result array

					})

					test("value and start arguments", function() {

						var a1 = IArray([1, 2, 3, 4, 5])
						var a2 = a1.fill(9, 2)
						assert.deepEqual(a1, IArray([1, 2, 3, 4, 5])) // this shouldn't change
						assert.deepEqual(a2.toArray(), [1, 2, 9, 9, 9]) // fill 9s starting at item 2

					})

					test("value, start & end arguments", function() {

						var a1 = IArray([1, 2, 3, 4, 5])
						var a2 = a1.fill(9, 2, 4)
						assert.deepEqual(a1, IArray([1, 2, 3, 4, 5])) // this shouldn't change
						assert.deepEqual(a2.toArray(), [1, 2, 9, 9, 5]) // fill 9s starting at item 2, ending at 4

					})
				}) // END section("fill")

			test("filter", function() {

					function even(n) { return n % 2 === 0 }

					var a1 = IArray([1, 2, 3, 4, 5, 6])
					var a2 = a1.filter(even)
					assert.deepEqual(a1, IArray([1, 2, 3, 4, 5, 6])) // this shouldn't change
					assert.deepEqual(a2.toArray(), [2, 4, 6]) // even values only

				})

			test("find", function() {

					function g10(n) { return n > 10 }
					function g100(n) { return n > 100 }

					var a1 = IArray([5, 10, 15, 20, 25, 30])
					assert.equal(a1.find(g10), 15)
					assert.equal(a1.find(g100), undefined)

				})

			test("findIndex", function() {

					function g10(n) { return n > 10 }
					function g100(n) { return n > 100 }

					var a1 = IArray([5, 10, 15, 20, 25, 30])
					assert.equal(a1.findIndex(g10), 2)
					assert.equal(a1.findIndex(g100), -1)

				})

			test("forEach", function() {

					var total = 0
					function addToTotal(x) { total += x }

					var a1 = IArray([5, 10, 15, 20, 25, 30])
					a1.forEach(addToTotal)
					assert.equal(total, 105)

				})

			test("includes", function() {

					var a1 = IArray([5, 10, 15, 20, 25, 30])
					assert(a1.includes(25))
					assert(!a1.includes(26))

				})

			test("indexOf", function() {

					var a1 = IArray([5, 10, 15, 20, 25, 30])
					assert.equal(a1.indexOf(5), 0)
					assert.equal(a1.indexOf(20), 3)
					assert.equal(a1.indexOf(30), 5)
					assert.equal(a1.indexOf(40), -1)

				})

			test("join", function() {

					var a1 = IArray([5, 10, 15, 20])
					assert.equal(a1.join("-"), "5-10-15-20")

				})

			test("keys", function() {

					var a1 = IArray([5, 10, 15])
					var iterator = a1.keys()
					assert.deepEqual(iterator.next(), { value: 0, done: false })
					assert.deepEqual(iterator.next(), { value: 1, done: false })
					assert.deepEqual(iterator.next(), { value: 2, done: false })
					assert.deepEqual(iterator.next(), { value: undefined, done: true })

				})

			test("lastIndexOf", function() {

					var a1 = IArray([2, 5, 9, 2])
					assert.equal(a1.lastIndexOf(2), 3)
					assert.equal(a1.lastIndexOf(7), -1)

				})

			test("map", function() {

					var a1 = IArray([1, 4, 9, 25])
					var a2 = a1.map(Math.sqrt)
					assert.deepEqual(a1, IArray([1, 4, 9, 25])) // ensure it is unchanged
					assert.deepEqual(a2, IArray([1, 2, 3, 5])) // mapped values

				})

			test("pop", function() {

						var a1 = IArray([1, 4, 9])

						var a2 = a1.pop()
						var a3 = a2.pop()
						var a4 = a3.pop()
						var a5 = a4.pop()

						assert.deepEqual(a1, IArray([1, 4, 9])) // ensure no changes

						assert.deepEqual(a2.toArray(), [1, 4]) // last value removed
						assert.equal(a2.ret, 9) // popped value

						assert.deepEqual(a3.toArray(), [1])
						assert.equal(a3.ret, 4) // popped value

						assert.deepEqual(a4.toArray(), [])
						assert.equal(a4.ret, 1) // popped value

						assert.deepEqual(a5.toArray(), [])
						assert.equal(a5.ret, undefined) // popped value

				})

			test("push", function() {

					var a1 = IArray([1, 4, 9])

					var a2 = a1.push(100)
					var a3 = a2.push([1, 2])
					var a4 = a3.push(undefined)
					var a5 = a4.push(null)

					assert.deepEqual(a1, IArray([1, 4, 9]))
					assert.deepEqual(a3.toArray(), [1, 4, 9, 100, [1, 2]]) // check this intermediary
					assert.deepEqual(a5.toArray(), [ 1, 4, 9, 100, [1, 2], undefined, null])

				})

			test("reduce", function() {

					var a1 = IArray([5, 10, 15, 20])
					var sum = a1.reduce(function(total, num) {
							return total + num
						})
					assert.deepEqual(a1, IArray([5, 10, 15, 20])) // this shouldn't change
					assert.equal(sum, 50)

				})

			test("reduceRight", function() {

					var a1 = IArray([5, 10, 25, 100])
					var sum = a1.reduceRight(function(total, num) {
							return total - num
						})
					assert.deepEqual(a1, IArray([5, 10, 25, 100])) // this shouldn't change
					assert.equal(sum, 60)

				})

			test("reverse", function() {

					var a1 = IArray(["one", "two", "three"])
					var a2 = a1.reverse()
					assert.deepEqual(a1.toArray(), ["one", "two", "three"]) // this shouldn't change
					assert.deepEqual(a2.toArray(), ["three", "two", "one"]) // reversed

				})

			test("shift", function() {

						var a1 = IArray([1, 4, 9])

						var a2 = a1.shift()
						var a3 = a2.shift()
						var a4 = a3.shift()
						var a5 = a4.shift()

						assert.deepEqual(a1, IArray([1, 4, 9])) // ensure no changes

						assert.deepEqual(a2.toArray(), [4, 9]) // first value removed
						assert.equal(a2.ret, 1) // shifted out value

						assert.deepEqual(a3.toArray(), [9])
						assert.equal(a3.ret, 4) // shifted out value

						assert.deepEqual(a4.toArray(), [])
						assert.equal(a4.ret, 9) // shifted out value

						assert.deepEqual(a5.toArray(), [])
						assert.equal(a5.ret, undefined) // shifted out value

				})

			section("slice", function() {

					test("no argument slice", function() {

							var a1 = IArray([1, 4, 9])
							var a2 = a1.slice()

							assert.deepEqual(a1, IArray([1, 4, 9])) // ensure no changes
							assert.deepEqual(a2, IArray([1, 4, 9])) // should be same value

						})

					test("include starting index", function() {

							var a1 = IArray([1, 4, 9])
							var a2 = a1.slice(1)
							var a3 = a1.slice(-2)

							assert.deepEqual(a1, IArray([1, 4, 9])) // ensure no changes
							assert.deepEqual(a2, IArray([4, 9])) // should be same value
							assert.deepEqual(a3, IArray([4, 9])) // should be same value

						})

					test("include starting index", function() {

							var a1 = IArray([5, 10, 15, 20])
							var a2 = a1.slice(1, 3)
							var a3 = a1.slice(-2, 3)

							assert.deepEqual(a1, IArray([5, 10, 15, 20])) // ensure no changes
							assert.deepEqual(a2, IArray([10, 15])) // elements 1 and 2
							assert.deepEqual(a3, IArray([15])) // second from last to 3rd is just 15

						})

				}) // end section("slice")

			test("some", function() {

					function g10(n) { return n > 10 }
					function g100(n) { return n > 100 }

					var a1 = IArray([5, 10, 15, 20])
					assert(a1.some(g10))
					assert(!a1.some(g100))

				})

			test("sort", function() {

					var fruit = ["cherries", "apples", "bananas"]
					var a1 = IArray(fruit)
					var a2 = a1.sort()
					var a3 = a1.sort(function(a, b) { return a.length - b.length }) // sort by word length

					assert.deepEqual(a1.toArray(), fruit) // unchanged
					assert.deepEqual(a2.toArray(), fruit.sort())
					assert.deepEqual(a3.toArray(), fruit.sort(function(a, b) { return a.length - b.length }))

				})

			section("splice", function() {

					test("single start argument", function() {

							var a1 = IArray([5, 10, 15, 20])
							var a2 = a1.splice(1)
							var a3 = a1.splice(2)

							assert.deepEqual(a1.toArray(), [5, 10, 15, 20]) // unchanged
							assert.deepEqual(a2.toArray(), [5]) // up to element 1 remains
							assert.deepEqual(a2.ret.toArray(), [10, 15, 20]) // from element 1
							assert.deepEqual(a3.toArray(), [5, 10]) // up to element 2 remains
							assert.deepEqual(a3.ret.toArray(), [15, 20]) // from element 2

						})

					test("start and delete count arguments", function() {

							var a1 = IArray([5, 10, 15, 20])
							var a2 = a1.splice(1, 1)
							var a3 = a1.splice(1, 2)

							assert.deepEqual(a1.toArray(), [5, 10, 15, 20]) // unchanged
							assert.deepEqual(a2.toArray(), [5, 15, 20]) // element 1 was removed
							assert.deepEqual(a2.ret.toArray(), [10]) // array with element 1 returned
							assert.deepEqual(a3.toArray(), [5, 20]) // element 1 and 2 were removed
							assert.deepEqual(a3.ret.toArray(), [10, 15]) // array with element 1 and 2 only

						})

					test("with added elements", function() {

							var a1 = IArray([5, 10, 15, 20])
							var a2 = a1.splice(1, 1, 22)
							var a3 = a1.splice(1, 2, 90, 80, 70)
							var a4 = a1.splice(1, 2, [1, 2, 3])
							var a5 = a1.splice(1, 2, IArray([1, 2, 3]))

							assert.deepEqual(a1.toArray(), [5, 10, 15, 20]) // unchanged
							assert.deepEqual(a2.toArray(), [5, 22, 15, 20]) // element 1 replaced with 22
							assert.deepEqual(a2.ret.toArray(), [10]) // array with element 1 returned
							assert.deepEqual(a3.toArray(), [5, 90, 80, 70, 20]) // element 1 and 2 replaced
							assert.deepEqual(a3.ret.toArray(), [10, 15]) // array with element 1 and 2 only
							assert.deepEqual(a4.toArray(), [5, [1, 2, 3], 20]) // element 1 and 2 replaced
							assert.deepEqual(a4.ret.toArray(), [10, 15]) // array with element 1 and 2 only
							assert.deepEqual(a5.toArray(), [5, IArray([1, 2, 3]), 20]) // element 1 and 2 replaced
							assert.deepEqual(a5.ret.toArray(), [10, 15]) // array with element 1 and 2 only

						})

				}) // END of section("splice")

			test("toString", function() {

					assert.equal(IArray([1, 2, 3]).toString(), "1,2,3")

				})

			test("unshift", function() {

					var a1 = IArray([5, 10, 20])
					var a2 = a1.unshift()
					var a3 = a1.unshift(6)
					var a4 = a1.unshift("hello", "world")

					assert.deepEqual(a1.toArray(), [5, 10, 20]) // unchanged
					assert.deepEqual(a2.toArray(), [5, 10, 20]) // unchanged
					assert.deepEqual(a3.toArray(), [6, 5, 10, 20]) // 6 prepended to start
					assert.deepEqual(a4.toArray(), [ "hello", "world", 5, 10, 20]) // prepended to start

				})

			test("rm", function() {

					var a1 = IArray([5, 6, 7, 8, 9, 10])
					var a2 = a1.rm(8)
					var a3 = a1.rm(23)	// test removal of non-existant entry

					assert.deepEqual(a1.toArray(), [5, 6, 7, 8, 9, 10]) // unchanged
					assert.deepEqual(a2.toArray(), [5, 6, 7, 9, 10]) // a1 with 8 value removed
					assert.equal(a2.ret, 8) // here is the removed value
					assert.deepEqual(a3.toArray(), [5, 6, 7, 8, 9, 10]) // unchanged since 23 was not present
					assert.equal(a3.ret, undefined) // ensure return value was set as undefined
				})

				test("rmAt", function() {

						var a1 = IArray([5, 6, 7, 8, 9, 10])
						var a2 = a1.rmAt(2) // removes the 7 at position 2
						var a3 = a1.rmAt(7)	// test removal of non-existant entry

						assert.deepEqual(a1.toArray(), [5, 6, 7, 8, 9, 10]) // unchanged
						assert.deepEqual(a2.toArray(), [5, 6, 8, 9, 10]) // a1 with 7 value at position 2 removed
						assert.equal(a2.ret, 7) // here is the removed value
						assert.deepEqual(a3.toArray(), [5, 6, 7, 8, 9, 10]) // unchanged since no value at position 7
						assert.equal(a3.ret, undefined) // ensure return value was set as undefined
					})
		}

		function testImmutableIndexChanges()
		{
			test("immutable in setting indexed values", function() {

					var a = IArray([5, 6, 7])

					a[0] = 100

					assert.equal(a[0], 5)

					a.length = 0

					assert.equal(a.length, 3)

					var b = a.set(0, 200)

					assert.equal(a[0], 5)
					assert.equal(b[0], 200)

				})
		}

		section("Full Array Testing with No Freezing", function() {

				IArray.freeze = "NONE"

				testFullArrayAPI()

		})

		section("Full Array Testing with Shallow Freezing", function() {

				IArray.freeze = "SHALLOW"

				testImmutableIndexChanges()
				testFullArrayAPI()

		})

		section("Full Array Testing with Deep Freezing", function() {

				IArray.freeze = "DEEP"

				testImmutableIndexChanges()
				testFullArrayAPI()

		})
}))
