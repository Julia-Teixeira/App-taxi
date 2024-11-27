import { FastifyRequest, FastifyReply } from "fastify";
import rideRepository from "../database/repository/ride.repository";
import rideService from "../service/ride.service";
import {
  TConfirmRequest,
  TEstimateRequest,
} from "../interface/rideRepository.interface";

class RideController {
  async estimate(request: FastifyRequest, reply: FastifyReply) {
    const dataBody = request.body as TEstimateRequest;

    if (
      dataBody.origin == undefined ||
      dataBody.destination == undefined ||
      dataBody.customer_id == undefined ||
      dataBody.origin == dataBody.destination
    ) {
      return reply.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos ",
      });
    }

    const data = await rideService.estimate(dataBody);
    return reply.status(200).send(data);
  }

  async confirm(request: FastifyRequest, reply: FastifyReply) {
    const dataBody = request.body as TConfirmRequest;
    if (
      dataBody.origin == undefined ||
      dataBody.destination == undefined ||
      dataBody.customer_id == undefined ||
      dataBody.origin == dataBody.destination
    ) {
      return reply.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "Os dados fornecidos no corpo da requisição são inválidos",
      });
    }

    const driver = await rideRepository.getDriver(dataBody.driver.id);

    if (driver == undefined) {
      return reply.status(400).send({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado",
      });
    }

    if (driver.km >= Number(dataBody.distance)) {
      return reply.status(400).send({
        error_code: "INVALID_DISTANCE",
        error_description: "Quilometragem inválida para o motorista",
      });
    }
    const data = await rideService.confirm(dataBody);

    return reply.status(200).send(data);
  }

  async getRides(request: FastifyRequest, reply: FastifyReply) {
    const { customer_id } = request.params as { customer_id: string };
    const { driver_id }: any = request.query as { driver_id: string };

    if (!customer_id) {
      return reply.status(400).send({
        error_code: "INVALID_DATA",
        error_description:
          "O id do usuário não foi fornecido no parâmetro da requisição ",
      });
    }

    if (driver_id) {
      const driver = await rideRepository.getDriver(+driver_id);

      if (driver == undefined) {
        return reply.status(400).send({
          error_code: "INVALID_DRIVER",
          error_description: "Motorista invalido",
        });
      }
    }

    let data = await rideService.getRidesByUserId(+customer_id);

    if (driver_id) {
      data = await rideService.getRidesByUserId(+customer_id, +driver_id);
    }

    if (data.rides.length == 0) {
      return reply.status(404).send({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhum registro encontrado",
      });
    }

    return reply.status(200).send(data);
  }
}

export default new RideController();
