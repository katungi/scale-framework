import * as acorn from "npm:acorn@8.11.3";
import { AST, Fragment, Text, Expression, Element, Attribute, Script } from "./type.ts";

export function Parser(content: string) {
    let i = 0
    const ast = {} as AST
    ast.html = parseFragments(() => i < content.length)

    return ast


    function match(str: string) {
        return content.startsWith(str, i)
    }

    function eat(str: string) {
        if (match(str)) {
            i += str.length
        } else {
            throw new Error(`Expected ${str} but got ${content.slice(i, i + 10)}`)
        }
    }


    function readWhileMatching(regex: RegExp) {
        let startIndex = i;
        while (i < content.length && regex.test(content[i])) {
            i++;
        }

        return content.slice(startIndex, i);
    }

    function skipWhiteSpaces() {
        readWhileMatching(/[\s\n]/);
    }

    function parseFragments(condition: any): Fragment[] {
        const fragments: Fragment[] = [];
        while (condition()) {
            const fragment = parseFragment();
            if (fragment) {
                fragments.push(fragment);
            }
        }
        return fragments
    }

    function parseFragment() {
        // @ts-ignore
        return parseScript() ?? parseElement() ?? parseExpression() ?? parseText()
    }

    // Parse a script tag and return the parsed code
    function parseScript() {
        if (match('<script>')) {
            eat('<script>');
            const startIndex = i;
            const endIndex = content.indexOf('</script>', i);
            const code = content.slice(startIndex, endIndex);
            ast.script = acorn.parse(code, { ecmaVersion: 2022 });
            i = endIndex;
            eat('</script>');
        }
    }

    function parseExpression() {
        if (match('{')) {
            eat('{');
            const expression = parseJavaScript();
            eat('}');
            return {
                type: 'Expression',
                expression,
            };
        }
    }

    function parseText() {
        const text = readWhileMatching(/[^<{]/);
        if (text.trim() !== '') {
            return {
                type: 'Text',
                value: text,
            };
        }
    }
    function parseElement() {
        if (match('<')) {
            eat('<')
            const tagName = readWhileMatching(/[a-z]/);
            const attributes = parseAttributeList();
            eat('>')
            const endTag = `</${tagName}>`

            const element: Element = {
                type: 'Element',
                name: tagName,
                attributes,
                children: parseFragments(() => !match(endTag))
            };
            eat(endTag);
            return element;
        }
    }

    function parseJavaScript() {
        const js = acorn.parseExpressionAt(content, i, { ecmaVersion: 2022 });
        i = js.end;

        console.log(typeof js)
        return js;
    }

    function parseAttribute(): Attribute {
        const name = readWhileMatching(/[^=]/);
        eat('={');
        const value = parseJavaScript();
        eat('}');
        return {
            type: 'Attribute',
            name,
            value,
        };
    }
    function parseAttributeList(): Attribute[] {
        const attributes: Attribute[] = []
        skipWhiteSpaces()
        while (!match('>')) {
            attributes.push(parseAttribute())
            skipWhiteSpaces()
        }
        return attributes
    }
}