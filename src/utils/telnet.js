// telnet7dtd.js
import { Telnet } from "telnet-client";

export class SevenDTD {
  constructor({ host, port, password, announce }) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.connection = new Telnet();
    this.announce = announce; // function(line) -> void
    this.buffer = "";
  }

  async connect() {
    const params = {
      host: this.host,
      port: this.port,
      negotiationMandatory: false,
      timeout: 1500,
      shellPrompt: /.*>/,
    };

    await this.connection.connect(params);
    await this.connection.send(this.password, { timeout: 1500 });

    this.connection.on("data", (buf) => this._accumulate(buf));
    this.connection.on("close", () => setTimeout(() => this.connect(), 2000));
    this.connection.on("error", () => setTimeout(() => this.connect(), 2000));
  }

  _accumulate(buf) {
    this.buffer += buf.toString();
    const parts = this.buffer.split("\n");
    this.buffer = parts.pop();
    for (const line of parts) this._process(line.trim());
  }

  _process(line) {
    if (!line) return;

    // raw pass-through for debugging
    // this.announce(line);

    // player events
    if (
      line.includes("joined the game") ||
      line.includes("Player connected") ||
      line.includes("disconnected") ||
      line.includes("INF Chat")
    ) {
      this.announce(line);
      return;
    }

    // new day at server time 04:00
    if (line.includes("INF Time: Day")) {
      const m = line.match(/Day\s+(\d+),\s*([0-9:]+)/);
      if (m) {
        const [, day, time] = m;
        if (time === "04:00") {
          this.announce(`New day ${day} has begun.`);
        }
      }
      return;
    }

    // blood moon start
    if (
      line.includes("BloodMoon") &&
      (line.toLowerCase().includes("starting") ||
        line.toLowerCase().includes("start"))
    ) {
      this.announce("Blood moon is starting.");
      return;
    }

    // blood moon end
    if (
      line.includes("BloodMoon") &&
      (line.toLowerCase().includes("end") ||
        line.toLowerCase().includes("finished"))
    ) {
      this.announce("Blood moon is over.");
      return;
    }
  }

  onData(handler) {
    this.announce = handler;
  }
}
