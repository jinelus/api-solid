
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repositor";
import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { GetUserProfileUseCase } from "./get-user-profile";
import { RessourceNotFoundError } from "./errors/ressource-not-found-error";

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase


describe('Get user profile use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })

    it('should be able to get user\'s profile', async () => {
        

        const passwordHash = await hash('123456', 3)

        const userCreated = await usersRepository.create({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password_hash: passwordHash,
        })

        const { user } = await sut.execute({
            userId: userCreated.id
        })

       expect(user.id).toEqual(expect.any(String))
    })

    it('should be not able to get user profile', async () => {
        await expect(() => sut.execute({
            userId: 'not-existing-id'
        })).rejects.toBeInstanceOf(RessourceNotFoundError)
    })

    
})