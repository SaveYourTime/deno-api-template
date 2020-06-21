import { serve } from "https://deno.land/std@0.58.0/http/server.ts";

const server = serve({ port: 3000 });

console.log("Application is running on: http://localhost:3000");

for await (const req of server) {
  req.respond({ body: "Hello World\n" });
}
