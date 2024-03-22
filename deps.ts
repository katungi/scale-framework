// Import deps for Compiler and Analyzer
export * as acorn from "npm:acorn@8.11.3"
export * as escodegen from "npm:escodegen@2.1.0"
export * as estreewalker from "npm:estree-walker@3.0.3"
export * as periscopic from "npm:periscopic@4.0.2"

// Server stuff
export { serve } from "https://deno.land/std@0.107.0/http/server.ts";
export { existsSync } from "https://deno.land/std@0.107.0/fs/mod.ts";
export { resolve, toFileUrl } from "https://deno.land/std@0.107.0/path/mod.ts";
export { serveDir, serveFile } from "https://deno.land/std@0.207.0/http/file_server.ts";