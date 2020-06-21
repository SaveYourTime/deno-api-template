import { serve } from "https://deno.land/std@0.58.0/http/server.ts";

const { HOST, PORT, ORIGIN } = Deno.env.toObject();

const server = serve({ hostname: HOST, port: +PORT });

console.log(`Application is running on: http://${HOST}:${PORT}`);
console.log(`Accepting requests from origin: "${ORIGIN}"`);

for await (const req of server) {
  req.respond({ body: "Hello World" });
}
