#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "[gdscript-lsp] Building TCP-to-stdio bridge..."
cd "$PLUGIN_DIR/bridge"
npm install
npm run build

echo "[gdscript-lsp] Linking bridge command globally..."
npm link

echo "[gdscript-lsp] Registering marketplace with Claude Code..."
claude plugin marketplace add "$PLUGIN_DIR"

echo "[gdscript-lsp] Installing plugin..."
claude plugin install gdscript-lsp

echo ""
echo "[gdscript-lsp] Done! To use:"
echo "  1. Open your Godot project in the editor (starts LSP on port 6005)"
echo "  2. Run Claude Code in your Godot project directory"
echo "  3. Code intelligence activates automatically for .gd files"
echo ""
echo "For headless mode: godot --editor --headless --lsp-port 6005"
