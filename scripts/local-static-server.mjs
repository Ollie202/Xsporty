import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    const cleanPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const filePath = path.join(root, cleanPath || "index.html");
    const safePath = path.normalize(filePath);

    if (!safePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const stat = await fs.stat(safePath).catch(() => null);
    const finalPath = stat?.isDirectory() ? path.join(safePath, "index.html") : safePath;
    const data = await fs.readFile(finalPath).catch(async () => fs.readFile(path.join(root, "index.html")));
    const ext = path.extname(finalPath);
    res.writeHead(200, {
      "Content-Type": types[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Local server error");
  }
});

server.listen(port, host, () => {
  console.log(`X Cup local frontend: http://${host}:${port}`);
});
