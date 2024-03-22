import { Parser } from "./compiler/parser.ts";
import { Analyze } from "./compiler/analyses.ts";
import { Generate } from "./compiler/generator.ts";
import { serveDir, serveFile } from "./deps.ts";
import { join } from "https://deno.land/std@0.107.0/path/win32.ts";

const decode = new TextDecoder("utf-8")
const fileContent = Deno.readFileSync("./app/app.scale")

const content = decode.decode(fileContent)

const parsed = Parser(content)

const analysis = Analyze(parsed)

const generatedCode = Generate(parsed, analysis)

Deno.writeTextFileSync("./app/app.gen.js", generatedCode)

Deno.serve((req: Request) => {
  const p = new URL(req.url).pathname
  
  if (p === '/') {
    return serveFile(req, './app/index.html')
  } else if (p === '/app.gen.js') {
    return serveFile(req, './app/app.gen.js')
  }

  return new Response('Not found', { status: 404 })
})

