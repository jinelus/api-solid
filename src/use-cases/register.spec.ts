import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repositor'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUser: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register use case', () => {

    beforeEach(() => {
        inMemoryUser = new InMemoryUsersRepository()

        //sut => System Under Test / para evitar confusão na mudança do nome da variavel em cada teste
        sut = new RegisterUseCase(inMemoryUser)
    })

    it('should be able to create a user', async () => {
        const { user} = await sut.execute({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password: '123456'
        })
        
        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user} = await sut.execute({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password: '123456'
        })
        
        const correctHashPassword = await compare('123456', user.password_hash)

        expect(correctHashPassword).toBe(true)
    })

    it('should be not able to register user with same email', async () => {
        await sut.execute({
            name: 'Usuario Teste',
            email: 'TtK7g@example.com',
            password: '123456'
        })
        
        await expect(() => 
            sut.execute({
                name: 'Usuario Teste',
                email: 'TtK7g@example.com',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})