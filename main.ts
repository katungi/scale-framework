import { Parser } from "./parser.ts";
import { Analyze } from "./analyses.ts";

const decode = new TextDecoder("utf-8")
const fileContent = Deno.readFileSync("./app/app.scale")

const content = decode.decode(fileContent)

const parsed = Parser(content)

const analysis = Analyze(parsed)

// console.log(analysis)

// const analysis = Analyze(parsed)

// const generatedCode = Generate(analysis)

// Deno.writeFileSync("./app/app.gen.js", new TextEncoder().encode(generatedCode))