import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckInUseCase } from "../validate-check-ins";

export function makeValidateCheckinUseCase() {

    const checkinsRepository = new PrismaCheckInsRepository()
    const useCase = new ValidateCheckInUseCase(checkinsRepository)

    return useCase
}