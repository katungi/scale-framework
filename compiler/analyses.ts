// deno-lint-ignore-file
import { estreewalker, periscopic } from "../deps.ts";
import { AST, Fragment, AnalysisResult } from '../type.ts'

export function Analyze(ast: AST): AnalysisResult {
    const result: Partial<AnalysisResult> = {
        variables: new Set(),
        willChange: new Set(),
        willUseInTemplate: new Set(),
    }
    const script = ast.script as any

    const analysis = periscopic.analyze(script);
    result.variables = new Set(analysis.scope.declarations.keys());
    result.rootScope = analysis.scope;
    result.map = analysis.map;

    let currentScope: periscopic.Scope | null = analysis.scope;

    estreewalker.walk(script, {
        enter(node: any) { // You might want to define a more precise type for `node`
            if (result.map && result.map.has(node)) currentScope = result.map.get(node);
            if (node.type === 'UpdateExpression' && currentScope && currentScope.find_owner(node.argument.name) === result.rootScope) {
               result.willChange && result.willChange.add(node.argument.name); 
            }
        },
        leave(node: any) { 
            if (result.map && result.map.has(node) && currentScope) currentScope = currentScope.parent;
        }
    });

    function traverse(fragment: Fragment) {
        switch (fragment.type) {
            case 'Element':
                fragment.children?.forEach(child => traverse(child));
                // @ts-ignore
                fragment.attributes?.forEach(attribute => traverse(attribute));
                break;
            case 'Attribute':
                result.willUseInTemplate && result.willUseInTemplate.add(fragment.value.name);
                break;
            case 'Expression':
                result.willUseInTemplate && result.willUseInTemplate.add(fragment.expression.name);
                break;
        }
    }

    ast.html.forEach(fragment => traverse(fragment));
    return result as AnalysisResult;
}