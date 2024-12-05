import { CheckInRepository } from "@/repositories/checkin-repository";


interface GetUserMetricsUseCaseParams {
    userId: string
}

interface GetUserMetricsUseCaseResponse {
    checkInsCount: number
}

export class GetUserMetricsUseCase {
    constructor(private checkInsRepository: CheckInRepository){}

    async execute({
        userId
    }: GetUserMetricsUseCaseParams): Promise<GetUserMetricsUseCaseResponse> {
        
        const checkInsCount = await this.checkInsRepository.countByUser(userId)
    
        return {
            checkInsCount
        }
    }
}