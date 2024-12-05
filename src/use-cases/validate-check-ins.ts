import { CheckInRepository } from "@/repositories/checkin-repository";
import { CheckIn } from "@prisma/client";
import { AlreadyCheckingError } from "./errors/already-check-in-error"
import { RessourceNotFoundError } from "./errors/ressource-not-found-error";
import dayjs from "dayjs";
import { InvalidateError } from "./errors/invalidate-checkin-error";

interface ValidateCheckInUseCaseParams {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository
  ) {}

  async execute({
    checkInId
  }: ValidateCheckInUseCaseParams): Promise<ValidateCheckInUseCaseResponse> {

    const checkIn = await this.checkInRepository.findById(checkInId);

    if(!checkIn) {
      throw new RessourceNotFoundError()
    }

    if(checkIn.validated_at) {
      throw new AlreadyCheckingError()
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minutes')

    if(distanceInMinutesFromCheckInCreation > 20){
      throw new InvalidateError()
    }

    checkIn.validated_at = new Date();

    this.checkInRepository.save(checkIn);
    return { checkIn };
  }
}
