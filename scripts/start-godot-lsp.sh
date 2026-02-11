#!/bin/bash
# Start Godot in headless editor mode with LSP enabled
# Usage: ./start-godot-lsp.sh [project_path] [port]

PROJECT_PATH="${1:-.}"
PORT="${2:-6005}"
GODOT_BIN="${GODOT_PATH:-godot}"

if ! command -v "$GODOT_BIN" &> /dev/null; then
    echo "Error: Godot not found at '$GODOT_BIN'. Set GODOT_PATH environment variable."
    exit 1
fi

echo "Starting Godot LSP server on port $PORT for project: $PROJECT_PATH"
"$GODOT_BIN" --editor --headless --path "$PROJECT_PATH" --lsp-port "$PORT"
