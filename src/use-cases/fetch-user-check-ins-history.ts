import { CheckInRepository } from "@/repositories/checkin-repository";
import { CheckIn } from "@prisma/client";

interface FetchUserCheckInsHistoryUseCaseParams {
  userId: string;
  page?: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
  ) {}

  async execute({
    userId,
    page
  }: FetchUserCheckInsHistoryUseCaseParams): Promise<FetchUserCheckInsHistoryUseCaseResponse> {

    const checkIns = await this.checkInRepository.findManyByUser(userId, page ?? 1)


    return { checkIns };
  }
}
