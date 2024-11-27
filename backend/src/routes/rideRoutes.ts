import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import rideController from "../controller/ride.controller";

export const routes = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post(
    "/ride/estimate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return rideController.estimate(request, reply);
    }
  );

  fastify.patch(
    "/ride/confirm",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return rideController.confirm(request, reply);
    }
  );

  fastify.get(
    "/ride/:customer_id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return rideController.getRides(request, reply);
    }
  );
};
