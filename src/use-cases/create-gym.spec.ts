import { CreateGymUseCase } from "./create-gym";
import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memrory-gyms-repository";


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })  

    it('should be able to create a gym', async () => {
        const { gym } = await sut.execute({title: 'Gym 01', description: null, phone: null, latitude: -27.6718647, longitude: -52.2868655}) 

        expect(gym.id).toEqual(expect.any(String))
    })

})