# gdscript-lsp

GDScript language server for Claude Code, providing code intelligence for Godot Engine projects.

## Supported Extensions
`.gd`, `.gdshader`

## Prerequisites

1. **Godot Engine 4.x** — the LSP server is built into the editor
2. **Node.js 18+** — required to run the TCP-to-stdio bridge

## Installation

Run the install script from the marketplace root:

```bash
../../scripts/install.sh
```

This builds the bridge and makes the `gdscript-lsp-bridge` command available globally via `npm link`.

## Usage

1. Open your Godot project in the Godot Editor (starts LSP on port 6005)
2. Use Claude Code in your Godot project directory
3. Code intelligence activates automatically for `.gd` and `.gdshader` files

### Headless Mode (No GUI)

```bash
godot --editor --headless --lsp-port 6005
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `GODOT_LSP_PORT` | `6005` | Godot LSP server TCP port |
| `GODOT_LSP_HOST` | `127.0.0.1` | Godot LSP server host |
| `GODOT_LSP_DEBUG` | `false` | Enable verbose bridge logging |
