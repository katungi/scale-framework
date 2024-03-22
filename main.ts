import { Parser } from "./parser.ts";

const decode = new TextDecoder("utf-8")
const fileContent = Deno.readFileSync("./app/app.scale")

const content = decode.decode(fileContent)

const parsed = Parser(content)

console.log(parsed)

// const analysis = Analyze(parsed)

// const generatedCode = Generate(analysis)

// Deno.writeFileSync("./app/app.gen.js", new TextEncoder().encode(generatedCode))