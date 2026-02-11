import { EventEmitter } from "node:events";
import * as net from "node:net";

const INITIAL_RETRY_MS = 1000;
const MAX_RETRY_MS = 30000;
const BACKOFF_FACTOR = 2;

interface TcpConnectionEvents {
  connect: [];
  data: [Buffer];
  close: [];
  error: [Error];
}

export class TcpConnection extends EventEmitter<TcpConnectionEvents> {
  private socket: net.Socket | null = null;
  private retryMs = INITIAL_RETRY_MS;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private closing = false;

  constructor(
    private host: string,
    private port: number,
  ) {
    super();
  }

  connect(): void {
    this.closing = false;
    this.attempt();
  }

  send(data: Buffer): boolean {
    if (!this.socket || this.socket.destroyed) return false;
    return this.socket.write(data);
  }

  get connected(): boolean {
    return this.socket !== null && !this.socket.destroyed;
  }

  close(): void {
    this.closing = true;
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.socket) {
      this.socket.destroy();
      this.socket = null;
    }
  }

  private attempt(): void {
    if (this.closing) return;

    const socket = net.createConnection({ host: this.host, port: this.port });

    socket.on("connect", () => {
      this.socket = socket;
      this.retryMs = INITIAL_RETRY_MS;
      this.emit("connect");
    });

    socket.on("data", (chunk) => {
      this.emit("data", chunk);
    });

    socket.on("close", () => {
      this.socket = null;
      this.emit("close");
      this.scheduleReconnect();
    });

    socket.on("error", (err) => {
      this.emit("error", err);
      socket.destroy();
    });
  }

  private scheduleReconnect(): void {
    if (this.closing) return;
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      this.attempt();
    }, this.retryMs);
    this.retryMs = Math.min(this.retryMs * BACKOFF_FACTOR, MAX_RETRY_MS);
  }
}
