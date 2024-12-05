import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../checkin";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckinsUseCAse() {

    const checkinsRepository = new PrismaCheckInsRepository()
    const  gymsRepository = new PrismaGymsRepository()

    const useCase = new CheckInUseCase(checkinsRepository, gymsRepository)

    return useCase
}