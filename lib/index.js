module.exports = {
    rules : { "map" : {
        create: function(context) {
            let lodash = true;
        
            const isArrayAlready = (node) => {
              return node.parent.type === 'ConditionalExpression' &&
              node.parent.test.type === 'CallExpression' && 
              node.parent.test.callee.object.name === 'Array' &&
              node.parent.test.callee.property.name === 'isArray' &&
              node.parent.test.arguments[0].name === node.arguments[0].name
            }
        
            return {
              AssignmentExpression(node) {
                if (node.left.name === '_') lodash = false;
              },
              CallExpression(node) {
                if (!lodash) return;
                let fixFunc, code = '';
                
                if ( 
                  node.callee.object.name === '_' &&
                  node.callee.property.name === 'map' &&
                  !isArrayAlready(node)
                ) {
                  const variableText = context.getSourceCode().getText(node.arguments[0]);
                  if (node.arguments[0].type === 'ArrayExpression') {
                    code = `${variableText}.map(fn)`;
                    fixFunc = function(fixer) {
                        return fixer.replaceText(node, code)
                    }
                  } else if (node.arguments[0].type === 'ObjectExpression') { 
                    return;
                  } else {
                    code = `Array.isArray(${variableText}) ? ${variableText}.map(fn) : `;
                    fixFunc = function(fixer) {
                        return fixer.insertTextBefore(node, code)
                    }
                  }
                    
                  context.report({
                    node,
                    message: "Check variable on .isArray",
                    fix: fixFunc
                  });
                }
              }
            };
          }      
        }
    }
}
