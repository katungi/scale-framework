import { escodegen, estreewalker } from "../deps.ts";
import * as acorn from "npm:acorn@8.11.3";
import { AST, AnalysisResult } from "../type.ts";

interface ICode {
    variables: string[];
    create: string[];
    update: string[];
    destroy: string[];
}

export function Generate(ast: AST, analysis: AnalysisResult) {
    const code: ICode = {
        variables: [],
        create: [],
        update: [],
        destroy: [],
    }

    let counter = 1;
    // @ts-ignore
    function traverse(node, parent) {
        switch (node.type) {
            case 'Element': {
                const variableName = `${node.name}_${counter++}`;
                code.variables.push(variableName);
                code.create.push(
                    `${variableName} = document.createElement('${node.name}');`
                )
                node.attributes.forEach((attribute: any) => { // Explicitly type 'attribute' as 'any'
                    traverse(attribute, variableName);
                });
                node.children.forEach((child: any) => {
                    traverse(child, variableName);
                });
                code.create.push(`${parent}.appendChild(${variableName})`);
                code.destroy.push(`${parent}.removeChild(${variableName})`);
                break;
            }

            case 'Text': {
                const variableName = `txt_${counter++}`;
                code.variables.push(variableName);
                code.create.push(
                    `${variableName} = document.createTextNode('${node.value}')`
                );
                code.create.push(`${parent}.appendChild(${variableName})`);
                break;

            }

            case 'Attribute': {
                if (node.name.startsWith('on:')) {
                    const eventName = node.name.slice(3);
                    const eventHandler = node.value.name;
                    code.create.push(
                        `${parent}.addEventListener('${eventName}', ${eventHandler});`
                    );
                    code.destroy.push(
                        `${parent}.removeEventListener('${eventName}', ${eventHandler});`
                    );
                }
                break;
            }

            case 'Expression': {
                const variableName = `txt_${counter++}`;
                const expression = node.expression.name;
                code.variables.push(variableName);
                code.create.push(
                    `${variableName} = document.createTextNode(${expression})`
                );
                code.create.push(`${parent}.appendChild(${variableName});`);
                if (analysis.willChange.has(node.expression.name)) {
                    code.update.push(`if (changed.includes('${expression}')) {
                ${variableName}.data = ${expression};
              }`);
                }
                break;
            }

        }
    }

    ast.html.forEach(fragment => traverse(fragment, 'document.body'));

    const { rootScope, map } = analysis;

    let currentScope = rootScope as any;
    const script = ast.script as any;
    estreewalker.walk(script, {
        enter(node) {
            if (map.has(node)) currentScope = map.get(node);
            if (
                node.type === 'UpdateExpression' &&
                // @ts-ignore
                currentScope.find_owner(node.argument.name) === rootScope &&
                // @ts-ignore
                analysis.willUseInTemplate.has(node.argument.name)
            ) {
                this.replace({
                    type: 'SequenceExpression',
                    expressions: [
                        node,
                        // @ts-ignore
                        acorn.parseExpressionAt(
                            // @ts-ignore
                            `lifecycle.update(['${node.argument.name}'])`,
                            0,
                            {
                                ecmaVersion: 2022,
                            }
                        )
                    ]
                })
                this.skip();
            }
        },
        leave(node) {
            if (map.has(node) && currentScope) currentScope = currentScope.parent;
        }
    });
    return `
    export default function() {
        ${code.variables.map(v => `let ${v};`).join('\n')}
        ${escodegen.generate(ast.script)}
        const lifecycle = {
            create(target) {
                ${code.create.join('\n')}
            },
            update(changed) {
                ${code.update.join('\n')}
            },
            destroy() {
                ${code.destroy.join('\n')}
            }
        }
        return lifecycle;
    }
`
}

