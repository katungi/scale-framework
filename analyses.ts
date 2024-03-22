import { estreewalker, periscopic } from "./deps.ts";
import { AST, Token } from './type.ts'

export function Analyze(ast: AST) {
    const result = {
        variables: new Set(),
        willChange: new Set(),
        willUseInTemplate: new Set(),
    }

    const { scope: rootScope, map } = periscopic.analyze(ast.script);
    result.variables = new Set(rootScope.declarations.keys());
    result.rootScope = rootScope;
    result.map = map;

    let currentScope = rootScope;

    estreewalker.walk(ast.script, {
        enter(node) {
            if (map.has(node)) currentScope = map.get(node);
            if (node.type === 'UpdateExpression' && currentScope.find_owner(node.argument.name) === rootScope) {
                result.willChange.add(node.argument.name);
            }
        },
        leave(node) {
            if (map.has(node)) currentScope = currentScope.parent;
        }
    })

    function traverse(fragment) {
        switch (fragment.type) {
            case 'Element':
                fragment.children.forEach(child => traverse(child));
                fragment.attributes.forEach(attribute => traverse(attribute));
                break;
            case 'Attribute':
                result.willUseInTemplate.add(fragment.value.name);
                break;
            case 'Expression':
                result.willUseInTemplate.add(fragment.expression.name);
                break;
        }
    }

    ast.html.forEach(fragment => traverse(fragment));
    return result
}