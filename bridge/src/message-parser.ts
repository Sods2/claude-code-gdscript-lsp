const HEADER_DELIMITER = "\r\n\r\n";
const CONTENT_LENGTH = "Content-Length: ";

export class MessageParser {
  private buffer = Buffer.alloc(0);

  feed(data: Buffer): string[] {
    this.buffer = Buffer.concat([this.buffer, data]);
    const messages: string[] = [];

    while (true) {
      const headerEnd = this.buffer.indexOf(HEADER_DELIMITER);
      if (headerEnd === -1) break;

      const header = this.buffer.subarray(0, headerEnd).toString("ascii");
      const lengthLine = header
        .split("\r\n")
        .find((line) => line.startsWith(CONTENT_LENGTH));

      if (!lengthLine) {
        // Malformed header — skip past it
        this.buffer = this.buffer.subarray(headerEnd + HEADER_DELIMITER.length);
        continue;
      }

      const contentLength = parseInt(
        lengthLine.slice(CONTENT_LENGTH.length),
        10,
      );
      const messageStart = headerEnd + HEADER_DELIMITER.length;
      const messageEnd = messageStart + contentLength;

      if (this.buffer.length < messageEnd) break; // Incomplete body

      messages.push(this.buffer.subarray(messageStart, messageEnd).toString("utf-8"));
      this.buffer = this.buffer.subarray(messageEnd);
    }

    return messages;
  }

  static encode(content: string): Buffer {
    const body = Buffer.from(content, "utf-8");
    const header = `Content-Length: ${body.length}\r\n\r\n`;
    return Buffer.concat([Buffer.from(header, "ascii"), body]);
  }
}
