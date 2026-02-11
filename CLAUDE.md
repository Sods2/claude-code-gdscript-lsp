# GDScript LSP Plugin

GDScript language server plugin for Claude Code, providing code intelligence for Godot Engine projects.

## Architecture

This plugin uses Godot's built-in LSP server (TCP port 6005) via a Node.js bridge that translates between TCP and stdio protocols.

## Development

- Bridge source: `bridge/src/`
- Build: `cd bridge && npm run build`
- Zero runtime dependencies (Node.js built-ins only)
