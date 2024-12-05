import { UsersRepository } from "@/repositories/users-repository"
import bcrypt from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import type { User } from "@prisma/client"


interface RegisterUseCaseParams {
    email: string
    name: string
    password: string
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {

    constructor(private usersRepository: UsersRepository) {}

    async execute({
        email, name, password
    }: RegisterUseCaseParams): Promise<RegisterUseCaseResponse> {
        const passwordHash = await bcrypt.hash(password, 3)
    
        const existingEmailUser = await this.usersRepository.findByEmail(email)
    
        if(existingEmailUser){
            throw new UserAlreadyExistsError()
        }
    
        const user =  await this.usersRepository.create({name, email, password_hash: passwordHash})
    
        return { user }
    }
}