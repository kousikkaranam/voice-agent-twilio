import dotenv from "dotenv";
import { loadConfig } from "./config";
import { createApp, getIncomingRoute } from "./server";

dotenv.config({ quiet: true });

const config = loadConfig();
const app = createApp(config);

const server = app.listen(config.port, () => {
  console.info(`Voice agent listening on port ${config.port}`);

  if (config.publicBaseUrl) {
    console.info(`Voice webhook: ${config.publicBaseUrl}${getIncomingRoute()}`);
  }
});

let isShuttingDown = false;

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    console.info(`Received ${signal}. Shutting down.`);

    server.close(() => {
      process.exit(0);
    });
  });
}
