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

var ruleTester = new RuleTester({
    parserOptions: {
        ecmaVersion: 6
    }
});

ruleTester.run("lodash-map", rule, {
    valid: [
        "Array.isArray(obj) ? obj.map(fn) : _.map(obj, fn);",
        "_.map({ name: \"John\", surname: \"Doe\" }, fn);",
    ],
    invalid: [
        {
            code: "_.map(obj, fn);",
            output: "Array.isArray(obj) ? obj.map(fn) : _.map(obj, fn);",
            errors: [
                {
                    message: "map checker",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "var m1 = _.map([], fn); _ = {map: () => []}; var m2 = _.map([], fn);",
            output: "var m1 = [].map(fn); _ = {map: () => []}; var m2 = _.map([], fn);",
            errors: [
                {
                    message: "map checker",
                    type: "CallExpression"
                }
            ]
        },
        {
            code: "_.map([1, 2, 3], fn);",
            output: "[1, 2, 3].map(fn);",
            errors: [
                {
                    message: "map checker",
                    type: "CallExpression"
                }
            ]
        }
    ]
});