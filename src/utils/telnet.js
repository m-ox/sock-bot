// telnet7dtd.js
import { Telnet } from "telnet-client";

export class SevenDTD {
  constructor({ host, port, password }) {
    this.host = host;
    this.port = port;
    this.password = password;
    this.connection = new Telnet();
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
  }

  onData(handler) {
    this.connection.on("data", (buf) => {
      handler(buf.toString());
    });
  }
}
