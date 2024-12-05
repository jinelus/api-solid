import { GymsRepository } from "@/repositories/gyms-repository";
import { Gym } from "@prisma/client";


interface FetchNearByGymsUseCaseParams {
    userLatitude: number
    userLongitude: number
}

interface FetchNearByGymsUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearByGymsUseCase {
    constructor(private checkInsRepository: GymsRepository){}

    async execute({
        userLatitude,
        userLongitude
    }: FetchNearByGymsUseCaseParams): Promise<FetchNearByGymsUseCaseResponse> {
        
        const gyms = await this.checkInsRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude
        })
        
        return {
            gyms
        }
    }
}