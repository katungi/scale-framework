import { Parser } from "./compiler/parser.ts";
import { Analyze } from "./compiler/analyses.ts";
import { Generate } from "./compiler/generator.ts";

const decode = new TextDecoder("utf-8")
const fileContent = Deno.readFileSync("./app/app.scale")

const content = decode.decode(fileContent)

const parsed = Parser(content)

const analysis = Analyze(parsed)

const generatedCode = Generate(parsed, analysis)

Deno.writeFileSync("./app/app.gen.js", new TextEncoder().encode(generatedCode))