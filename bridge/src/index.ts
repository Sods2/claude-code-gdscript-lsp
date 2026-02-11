#!/usr/bin/env node

import { MessageParser } from "./message-parser.js";
import { TcpConnection } from "./tcp-connection.js";

const HOST = process.env["GODOT_LSP_HOST"] ?? "127.0.0.1";
const PORT = parseInt(process.env["GODOT_LSP_PORT"] ?? "6005", 10);
const DEBUG = process.env["GODOT_LSP_DEBUG"] === "true";

function log(msg: string): void {
  if (DEBUG) process.stderr.write(`[gdscript-lsp-bridge] ${msg}\n`);
}

// Parsers for each direction
const stdinParser = new MessageParser();
const tcpParser = new MessageParser();

// Buffer messages from stdin while TCP is not connected
const pendingToServer: Buffer[] = [];

const tcp = new TcpConnection(HOST, PORT);

tcp.on("connect", () => {
  log(`Connected to Godot LSP at ${HOST}:${PORT}`);

  // Flush buffered messages
  for (const msg of pendingToServer) {
    tcp.send(msg);
  }
  pendingToServer.length = 0;
});

tcp.on("data", (chunk) => {
  // Parse TCP data into LSP messages, forward each to stdout
  const messages = tcpParser.feed(chunk);
  for (const body of messages) {
    log(`← ${body.slice(0, 200)}`);
    const encoded = MessageParser.encode(body);
    process.stdout.write(encoded);
  }
});

tcp.on("close", () => {
  log("TCP connection closed, will reconnect...");
});

tcp.on("error", (err) => {
  log(`TCP error: ${err.message}`);
});

// Read stdin from Claude Code
process.stdin.on("data", (chunk) => {
  const messages = stdinParser.feed(chunk);
  for (const body of messages) {
    log(`→ ${body.slice(0, 200)}`);
    const encoded = MessageParser.encode(body);

    if (tcp.connected) {
      tcp.send(encoded);
    } else {
      pendingToServer.push(encoded);
    }
  }
});

process.stdin.on("end", () => {
  log("stdin closed, shutting down");
  tcp.close();
  process.exit(0);
});

// Start connecting
log(`Connecting to Godot LSP at ${HOST}:${PORT}...`);
tcp.connect();
