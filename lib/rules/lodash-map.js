/**
 * @fileoverview map
 * @author artemkopylov04
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "map",
            category: "Fill me in",
            recommended: false
        },
        fixable: "code",
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {
        let localArrays = [];
        let localObjects = [];
        let lodash = true;

        function changeAssignment(structure, type) {
            if (structure.includes(node.left.name) && node.right.type !== type) {
                const index = structure.indexOf(node.left.name);
                if (index > -1) {
                    structure.splice(index, 1);
                }
            } else if (!structure.includes(node.left.name) && node.right.type !== type) { 
                structure.push(node.left.name) 
            }
        }

        return {
          VariableDeclarator(node) {
            if (node.init.type === 'ArrayExpression' && !localArrays.includes(node.id.name)) {
              localArrays.push(node.id.name);
            }
            if (node.init.type === 'ObjectExpression' && !localObjects.includes(node.id.name)) {
              localObjects.push(node.id.name) 
            }
          },
          AssignmentExpression(node) {
              changeAssignment(localArrays, 'ArrayExpression');
              changeAssignment(localObjects, 'ObjectExpression');
            if (node.left.name === '_') lodash = false;
          },
          CallExpression(node) {
            if (!lodash) return;
            try {
              let fixFunc, code = '';
             
              if ( node.callee.object.name === '_' &&
                   node.callee.property.name === 'map' &&
                   node.arguments[0].type !== 'ObjectExpression' &&
                   node.arguments[0].type !== 'ArrayExpression' &&
                   !(
                     node.parent.type === 'ConditionalExpression' &&
                     node.parent.test.type === 'CallExpression' && 
                     node.parent.test.callee.object.name === 'Array' &&
                       node.parent.test.callee.property.name === 'isArray' &&
                       node.parent.test.arguments[0].name === node.arguments[0].name
                   )
                 ) {
                if (
                  !localArrays.includes(node.arguments[0].name) &&
                  !localObjects.includes(node.arguments[0].name)
                ) { 
                  code = `(Array.isArray(${node.arguments[0].name})) ? ${node.arguments[0].name}.map(fn) : `;
                  fixFunc = function(fixer) {
                    return fixer.insertTextBefore(node, code)
                  }
                } else if (!localObjects.includes(node.arguments[0].name)) {
                  code = `${node.arguments[0].name}.map(${node.arguments[1].name})`;
                  fixFunc = function(fixer) {
                    return fixer.replaceText(node, code);
                  }
                };
                
                context.report({
                  node,
                  message: "map checker",
                  fix: fixFunc
                });
              }
            }  catch(e)  {  
              console.log(node); console.error(e)  
            }
          }
        };
    }      
};