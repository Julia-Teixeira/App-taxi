import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes/rideRoutes";

require("dotenv").config({ path: "../.env" });

const app = Fastify({ logger: true });

const start = async () => {
  await app.register(cors);
  await app.register(routes);

  app.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Servidor rodando em ${address}`);
  });
};

start();
