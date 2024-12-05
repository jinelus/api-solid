import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";


interface FetchGymsByNameUseCaseParams {
    query: string,
    page: number
}

interface FetchGymsByNameUseCaseResponse {
    gyms: Gym[]
}

export class FetchGymsByNameUseCase {
    constructor(private checkInsRepository: GymsRepository){}

    async execute({
        query,
        page
    }: FetchGymsByNameUseCaseParams): Promise<FetchGymsByNameUseCaseResponse> {
        
        const gyms = await this.checkInsRepository.findByName(query, page)
    
        return {
            gyms
        }
    }
}