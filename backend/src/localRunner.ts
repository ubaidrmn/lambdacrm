import * as http from "http";
import { handler } from ".";
import { parse } from 'url';

const server = http.createServer(async (req: any, res: any) => {
    const parsedUrl = parse(req.url || '', true);
    const path = parsedUrl.pathname;
    const response = await handler({ path: path, httpMethod: req.method });
    res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
    res.end(response.body);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
