import rideRepository from "../database/repository/ride.repository";
import {
  TConfirmReply,
  TConfirmRequest,
  TEstimateReply,
  TEstimateRequest,
} from "../interface/rideRepository.interface";

class RideService {
  async estimate(data: TEstimateRequest): Promise<TEstimateReply> {
    return rideRepository.estimate(data);
  }

  async confirm(data: TConfirmRequest): Promise<TConfirmReply> {
    return rideRepository.confirm(data);
  }

  async getRidesByUserId(id: number, driver_id?: number) {
    if (driver_id) {
      return rideRepository.getRidesByUserId(id, driver_id);
    }

    return rideRepository.getRidesByUserId(id);
  }
}

export default new RideService();
