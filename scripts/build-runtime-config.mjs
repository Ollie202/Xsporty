import fs from "node:fs";

const defaultApiBaseUrl = "https://x-cup-backend-production.up.railway.app";
const apiBaseUrl = (
  process.env.XCUP_API_BASE_URL ||
  process.env.NEXT_PUBLIC_XCUP_API_BASE_URL ||
  defaultApiBaseUrl
).replace(/\/+$/, "");

const config = `window.XCUP_API_BASE_URL = ${JSON.stringify(apiBaseUrl)};\n`;

fs.writeFileSync("runtime-config.js", config);
console.log(`Runtime config written for ${apiBaseUrl}`);
