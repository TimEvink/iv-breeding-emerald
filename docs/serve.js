import fs from "node:fs";
import path from "node:path";
import http from "node:http";


const MIMES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".ico": "image/vnd.microsoft.icon"
};

const baseDir = path.join(process.cwd(), "docs/app");
const portArg = Number(process.argv[2]);
const port = Number.isInteger(portArg) && portArg > 0 ? portArg : 3000;

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

const timestamp = () => new Date().toISOString().split("T")[1].split(".")[0];

const logInfo = msg => console.log(`${colors.green}[${timestamp()}] ${msg}${colors.reset}`);
const logRequest = (method, url, status) => {
  const color = status >= 400 ? colors.red : colors.cyan;
  console.log(`${color}[${timestamp()}] ${method} ${url} → ${status}${colors.reset}`);
};

const server = http.createServer((request, response) => {
    if (request.method === "GET") {
        const strippedurl = request.url.split("?")[0];
        const reqpath = strippedurl === "/" ? "index.html" : strippedurl;
        const abspath = path.join(baseDir, reqpath);
        fs.readFile(abspath, (err, data) => {
            if (err) {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("Not found");
                logRequest(request.method, request.url, 404);
            } else {
                response.writeHead(200, { "Content-Type": MIMES[path.extname(abspath)] || "application/octet-stream" });
                response.end(data);
                logRequest(request.method, request.url, 200);
            }
        });
    } else {
        response.writeHead(405, { "Content-Type": "text/plain" });
        response.end("Method not allowed");
        logRequest(request.method, request.url, 405);
    }
});


server.listen(port, '127.0.0.1', () => {
    logInfo(`listening on http://localhost:${port}`);
})
