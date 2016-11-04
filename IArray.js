/* global define */

/*
    This Universal Module Definition (UMD) handles AMD, CommonJS, and Eki module loaders.
    If none of those is detected, it defines IArray on the global context.
*/
(function(global, factory) {
    if(typeof define === "function" && define.amd)
        define(factory)
	else if(typeof eki === "object" && eki.def)
		eki.def("IArray", factory)
    else if(typeof exports === "object")
        module.exports = factory()
    else
        global.IArray = factory()
	}(this, function() {

	"use strict"

	// These methods work fine as they are in Array and are non-destructive,
	// but they return an array, so just call the native method and upgrade
	// the returned array to an IArray
	var passAndReturn = ["filter", "map", "slice"]
		.reduce(function(p, c) {
			p[c] = function() {
					return IArray(Array.prototype[c].apply(this, arguments))
				}
			return p
		}, {})

	function concat()
	{
		var a2 = this.toArray() // first, clone ourselve to a standard Array

		for(var argi = 0;argi < arguments.length;argi++)
		{
			var arg = arguments[argi]
			if(arg && arg.isIArray)
				a2 = a2.concat(arg.toArray())
			else
				a2 = a2.concat(arg)
		}

		return IArray(a2)
	}

	// These methods are mutating, so first copy the array, then
	// operate on the copy, then return a new IA2
	var copyAndOperate = [ "copyWithin", "fill", "push", "pop", "reverse", "shift",
							"unshift", "sort", "splice"].reduce(function(p, c) {
			p[c] = function() {
					// create a mutable IArray object "clone" of this
					var a2 = createIArray(this),
						// perform the operation on it
						ret = Array.prototype[c].apply(a2, arguments)

					// if the returned value is a native array, convert to IArray
					if(Array.isArray(ret))
						ret = IArray(ret)

					// store the return value
					a2.ret = ret // place the return value here

					// Finally, freeze it and return
					return deepFreeze(a2)
				}
			return p
		}, {})

	function set(index, value)
	{
		var a2 = createIArray(this)
		a2[index] = value
		return deepFreeze(a2)
	}

	// Create our custom IArray prototype, with Array.prototype at the base
	var IAProto = Object.assign(
			Object.create(Array.prototype),
			passAndReturn,
			copyAndOperate,
			{
				concat: concat,
				isIArray: true,
				set: set,
				toArray: function() { return Array.prototype.slice.call(this) }
			}
		)

	function deepFreeze(o)
	{
		if(IArray.freeze === "SHALLOW" || IArray.freeze === "DEEP")
		{
			Object.freeze(o)

			if(IArray.freeze === "DEEP")
				Object.getOwnPropertyNames(o)
					.forEach(function(n) {
							if((typeof o[n] === "object" || typeof o[n] === "function") && !Object.isFrozen(o[n]))
								deepFreeze(o[n])
						})
		}

		return o
	}

	// Create hte IArray object. fromArray may be a native Array
	// or an IArray
	function createIArray(fromArray)
	{
		return Object.assign(
				Object.create(IAProto),
				fromArray,
				fromArray ? { length: fromArray.length } : null
			)
	}

	function IArray(fromArray)
	{
		return deepFreeze(createIArray(fromArray))
	}

	return IArray

}))
