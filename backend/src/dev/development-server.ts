import * as http from "http";
import { parse } from 'url';
import { createMockEvent } from "./event";
import { handler } from "@/index";

const server = http.createServer(async (req: any, res: any) => {
    let body = '';

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    req.on('data', (chunk: any) => {
        body += chunk.toString();;
    });
    
    req.on('end', async () => {
        const parsedUrl = parse(req.url || '', true);
        const path = parsedUrl.pathname;
        if (path) {
            const response = await handler(createMockEvent(path, req.method, body));
            res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
            res.end(response.body);
        } else {
            res.end("An error occured!")
        }
    })
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
