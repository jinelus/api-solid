import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import bcrypt from "bcryptjs";

interface AuthentifcateUseCaseRequest {
    email: string,
    password: string
}

interface AuthentifcateUseCaseResponse{
    user: User
}

export class AuthentifcateUseCase {

    constructor(private usersRepository: UsersRepository){}

    async execute({email, password}: AuthentifcateUseCaseRequest): Promise<AuthentifcateUseCaseResponse>{

        const user = await this.usersRepository.findByEmail(email)

        if(!user){
            throw new InvalidCredentialsError()
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash)

        if(!isPasswordCorrect){
            throw new InvalidCredentialsError()
        }

        return {
            user
        }
    }
}