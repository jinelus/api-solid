import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchGymsByNameUseCase } from "../fetch-gyms-by-name";

export function makeFetchGymsByNameUseCase() {

    const  gymsRepository = new PrismaGymsRepository()

    const useCase = new FetchGymsByNameUseCase( gymsRepository)

    return useCase
}