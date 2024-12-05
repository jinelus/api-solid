import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { RessourceNotFoundError } from "./errors/ressource-not-found-error";


interface GetProfileUseCaseParams {
    userId: string
}

interface GetProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private userRepository: UsersRepository){}

    async execute({
        userId
    }: GetProfileUseCaseParams): Promise<GetProfileUseCaseResponse> {
        
        const user = await this.userRepository.findById(userId)
    
        if(!user){
            throw new RessourceNotFoundError()
        }
    
        return { user }
    }
}