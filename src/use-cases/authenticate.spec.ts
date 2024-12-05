import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repositor";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthentifcateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository
let sut: AuthentifcateUseCase


describe('Authenticate use case', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthentifcateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        

        const passwordHash = await hash('123456', 3)

        await usersRepository.create({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password_hash: passwordHash,
        })

        const { user } = await sut.execute({
            email: 'TtK7g@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should be not able to authenticate with wrong password', async () => {
        

        const passwordHash = await hash('123456', 3)

        await usersRepository.create({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password_hash: passwordHash,
        })

        await expect(() => sut.execute({
            email: 'TtK7g@example.com',
            password: '12345645'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })


    it('should not be able to authenticate with wrong email', async () => {
        

        await expect(() => sut.execute({
            email: 'TtK7g@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
    
})