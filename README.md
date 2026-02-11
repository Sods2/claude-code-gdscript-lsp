# GDScript LSP Plugin for Claude Code

A [Claude Code](https://claude.ai/code) plugin that provides GDScript code intelligence for [Godot Engine](https://godotengine.org/) projects. Get real-time diagnostics, hover info, go-to-definition, completions, and more — powered by Godot's built-in LSP server.

## How It Works

```
Claude Code  ←stdio→  Bridge (Node.js)  ←TCP→  Godot LSP (port 6005)
```

Godot's built-in language server speaks TCP, but Claude Code's LSP plugin system expects stdio. This plugin includes a lightweight Node.js bridge (~200 lines, zero runtime dependencies) that translates between the two protocols. The bridge auto-reconnects if Godot restarts.

## Features

- **Diagnostics** — real-time errors and warnings in your `.gd` files
- **Hover** — type information and documentation on symbols
- **Go-to-definition** — jump to where functions, variables, and classes are defined
- **Completions** — context-aware code suggestions
- **Symbol search** — find symbols across your project
- **Auto-reconnect** — bridge reconnects automatically if Godot restarts

## Prerequisites

- **[Claude Code](https://claude.ai/code)** (v2.0.74+ with LSP plugin support)
- **[Godot Engine 4.x](https://godotengine.org/download)**
- **[Node.js 18+](https://nodejs.org/)**

## Installation

### Quick Install

```bash
git clone https://github.com/medrive/claude-code-gdscript-lsp.git
cd claude-code-gdscript-lsp
./scripts/install.sh
```

The install script will:
1. Build the TCP-to-stdio bridge
2. Link the `gdscript-lsp-bridge` command globally via `npm link`
3. Register the plugin marketplace with Claude Code
4. Install and enable the plugin

### Manual Install

```bash
# 1. Build the bridge
cd bridge && npm install && npm run build

# 2. Make it globally available
npm link

# 3. Register and install in Claude Code
claude plugin marketplace add /path/to/claude-code-gdscript-lsp
claude plugin install gdscript-lsp
```

### Verify Installation

```bash
claude plugin list
```

You should see `gdscript-lsp` listed and enabled. Restart Claude Code for the plugin to take effect.

## Usage

1. **Start Godot** — open your project in the Godot Editor (this starts the LSP server on port 6005)
2. **Run Claude Code** in your Godot project directory
3. **Code intelligence activates automatically** for `.gd` and `.gdshader` files

### Headless Mode (No GUI)

If you don't need the full editor open:

```bash
godot --editor --headless --lsp-port 6005
```

Or use the helper script:

```bash
./scripts/start-godot-lsp.sh /path/to/your/project
```

## Configuration

Set environment variables to customize behavior:

| Variable | Default | Description |
|----------|---------|-------------|
| `GODOT_LSP_PORT` | `6005` | Godot LSP server TCP port |
| `GODOT_LSP_HOST` | `127.0.0.1` | Godot LSP server host |
| `GODOT_LSP_DEBUG` | `false` | Enable verbose bridge logging to stderr |
| `GODOT_PATH` | `godot` | Path to Godot executable (for helper scripts) |

## Supported File Types

| Extension | Language |
|-----------|----------|
| `.gd` | GDScript |
| `.gdshader` | Godot Shading Language |

## Project Structure

```
claude-code-gdscript-lsp/
├── .claude-plugin/
│   └── marketplace.json     # Claude Code marketplace manifest
├── bridge/
│   ├── src/
│   │   ├── index.ts             # stdio ↔ TCP bridge orchestration
│   │   ├── tcp-connection.ts    # TCP socket with auto-reconnect
│   │   └── message-parser.ts   # LSP Content-Length message framing
│   ├── package.json
│   └── tsconfig.json
├── plugins/
│   └── gdscript-lsp/
│       └── README.md
├── scripts/
│   ├── install.sh               # One-shot setup
│   └── start-godot-lsp.sh      # Launch Godot in headless LSP mode
└── README.md
```

## Troubleshooting

**No diagnostics appearing**
- Make sure the Godot Editor is running with your project open
- Restart Claude Code after installing the plugin
- Check that `gdscript-lsp-bridge` is in your PATH: `which gdscript-lsp-bridge`

**Bridge not connecting**
- Enable debug logging: `export GODOT_LSP_DEBUG=true`
- Verify the port: Editor > Editor Settings > Network > Language Server
- Test connectivity: `nc -z 127.0.0.1 6005`

**Port conflicts**
- Multiple Godot instances can't share port 6005
- Override with `GODOT_LSP_PORT=6006` and configure Godot to match

**Uninstalling**
```bash
claude plugin uninstall gdscript-lsp
claude plugin marketplace remove gdscript-lsp
cd bridge && npm unlink -g
```

## License

MIT
