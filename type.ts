import { acorn, periscopic } from "./deps.ts";

export type Fragment = Element | Text | Expression | Script
export type Element = {
    type: string,
    name: string,
    attributes: Attribute[],
    children: Fragment[],
    value: any,
    expression: any
}

export type Attribute = {
    type: 'Attribute',
    name: string,
    value: any
}

export type Text = {
    type: 'Text',
    content: string
}

export type Expression = {
    type: 'Expression',
    content: string,
    name: string,
    expression: any
}

export type Script = {
    type: 'Script',
    ast: AST
}

export type AST = {
    html: Fragment[]
    script: acorn.Node
}

export type Token<T> = {
    variables: Set<T>,
    willChange: Set<T>,
    willUseInTemplate: Set<T>,
};

export interface AnalysisResult {
    variables: Set<string>;
    willChange: Set<string>;
    willUseInTemplate: Set<string>;
    rootScope: periscopic.Scope;
    map: WeakMap<any, any>; 
}