import * as path from "node:path";
import * as fs from "node:fs";
import * as http from "node:http";


const MIMES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".ico": "image/vnd.microsoft.icon",
    ".json": "application/json"
};

const baseDir = path.join(process.cwd(), "docs", "app");
const portArg = Number(process.argv[2]);
const port = Number.isInteger(portArg) && portArg > 0 ? portArg : 3000;

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m"
};

function timestamp(): string {
    return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

function logInfo(message: string): void {
    console.log(`${colors.green}[${timestamp()}] ${message}${colors.reset}`);
}

function logRequest(method: string | undefined, url: string | undefined, status: number): void {
  const color = status >= 400 ? colors.red : colors.cyan;
  console.log(`${color}[${timestamp()}] ${method ?? ""} ${url ?? ""} → ${status}${colors.reset}`);
}

const server = http.createServer((request, response) => {
    if (!(request.method === "GET")) {
        response.writeHead(405, { "Content-Type": "text/plain" });
        response.end("Method not allowed");
        logRequest(request.method, request.url, 405);
        return;
    }
    const strippedurl = request.url?.split("?")[0] ?? "";
    const reqpath = strippedurl === "/" ? "index.html" : strippedurl;
    const ext = path.extname(reqpath);
    if (!(ext in MIMES)) {
        response.writeHead(415, { "Content-Type": "text/plain" });
        response.end("Unsupported media type");
        logRequest(request.method, request.url, 415);
        return;
    }
    fs.readFile(path.join(baseDir, reqpath), (error, data) => {
        if (error) {
            if (error.code === "ENOENT") {
                response.writeHead(404, { "Content-Type": "text/plain" });
                response.end("Not found");
                logRequest(request.method, request.url, 404);
                return;
            }
            response.writeHead(500, { "Content-Type": "text/plain" });
            response.end("Error reading file");
            logRequest(request.method, request.url, 500);
            return;
        }
        response.writeHead(200, { "Content-Type": MIMES[ext as keyof typeof MIMES] });
        response.end(data);
        logRequest(request.method, request.url, 200);
    });
});

server.listen(port, '127.0.0.1', () => {
    logInfo(`listening on http://localhost:${port}\n`);
});
