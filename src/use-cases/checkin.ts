import { CheckInRepository } from "@/repositories/checkin-repository";
import { CheckIn } from "@prisma/client";
import { AlreadyCheckingError } from "./errors/already-check-in-error";
import { GymsRepository } from "@/repositories/gyms-repository";
import { RessourceNotFoundError } from "./errors/ressource-not-found-error";
import { getDistanceBetweenCoordinate } from "./utils/get-distance-between-coordinate";
import { TooFarDistanceError } from "./errors/too-far-distance-error";

interface CheckInUseCaseParams {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude
  }: CheckInUseCaseParams): Promise<CheckInUseCaseResponse> {

    const gym = await this.gymsRepository.findById(gymId);

    if(!gym) {
      throw new RessourceNotFoundError()
    }

    // calculate distance between gym and user
    const distance = getDistanceBetweenCoordinate(
      {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()},
      {latitude: userLatitude, longitude: userLongitude}
    )

    const MAX_DISTANCE_IN_KM = 0.1

    if(distance > MAX_DISTANCE_IN_KM){
      throw new TooFarDistanceError()
    }

    const checkInOnSameDay = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new AlreadyCheckingError();
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return { checkIn };
  }
}
