/**
 * @fileoverview map
 * @author artemkopylov04
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/lodash-map"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("lodash-map", rule, {
    valid: [
        "_.map([1, 2, 3], fn);",
        "_.map({ name: \"John\", surname: \"Doe\" }, fn);",
    ],
    invalid: [
        {
            code: "_.map(obj, fn);",
            errors: [
                {
                    message: "Check map on array argument",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "_.map(collection, fn);",
            errors: [
                {
                    message: "Check map on array argument",
                    type: "CallExpression"
                }
            ]
        }
    ]
});

`const collection = [1, 2, 3, 4, 5];
let co = [1, 2, 3];
let obj = { name: "John", surname: "Doe" };

_.map(collection, fn);

co = 1;

_.map(co, fn);

_.map([1, 2, 3], fn);

_.map(obj, fn);

obj = [1, 2, 3];

_.map(obj, fn);

obj = 1;

_.map(obj, fn);

_.map({ name: "John", surname: "Doe" }, fn);

(true) ? collection.map(fn) : _.map(collection, fn);

(true) ? co.map(fn) : _.map(co, fn);

(Array.isArray(collection)) ? collection.map(fn) : _.map(collection, fn);

if (true) { collection.map(fn) } else { _.map(collection, fn); }

if (Array.isArray(collection)) { collection.map(fn) } else { _.map(collection, fn); }

function anonymus(c) {
   _.map(c, fn);
}

return _.map(collection, fn);`