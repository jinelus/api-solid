import { beforeEach, describe, expect, it } from "vitest";
import { FetchGymsByNameUseCase } from "./fetch-gyms-by-name";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memrory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchGymsByNameUseCase;

describe("Fetch gyms by name use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchGymsByNameUseCase(gymsRepository);
  });

  it("should be able to fetch gyms by name", async () => {
    await gymsRepository.create({
      title: "Gym 01",
      description: null,
      phone: null,
      latitude: -27.6718647,
      longitude: -52.2868655
    });

    await gymsRepository.create({
      title: "Gym 03",
      description: null,
      phone: null,
      latitude: -27.6718647,
      longitude: -52.2868655
    });

    await gymsRepository.create({
      title: "Gym 03",
      description: null,
      phone: null,
      latitude: -27.6718647,
      longitude: -52.2868655
    });

    const { gyms } = await sut.execute({
      query: "Gym 03",
      page: 1
    });

    expect(gyms).toHaveLength(2)
  })

  it("should be able to fetch paginated check-in history", async () => {
    
    for(let i = 0; i < 22; i++) {
        await gymsRepository.create({
          title: `Gym-${i}`,
          description: null,
          phone: null,
          latitude: -27.6718647,
          longitude: -52.2868655
          });
    }

    const { gyms } = await sut.execute({
      query: "Gym",
      page: 2
    });

    expect(gyms).toEqual([
        expect.objectContaining({title: "Gym-20"}),
        expect.objectContaining({title: "Gym-21"}),
    ])
  });

});
