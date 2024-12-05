import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memrory-gyms-repository";
import { FetchNearByGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetch nearby gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Arena Fitness",
      description: null,
      phone: null,
      latitude: -27.641586145391827,
      longitude: -52.2628332753904
    });

    await gymsRepository.create({
      title: "Petros Barbell",
      description: null,
      phone: null,
      latitude: -27.644934092110624,
      longitude: -52.258912528487684
    });

    await gymsRepository.create({
      title: "Corpus",
      description: null,
      phone: null,
      latitude: -27.643571742214238,
      longitude: -52.26823217912048
    });

    await gymsRepository.create({
        title: "Up Fitness",
        description: null,
        phone: null,
        latitude: -27.639303822905987,
        longitude: -52.23685447110892
      });

    await gymsRepository.create({
        title: "Chapeco Fitness",
        description: null,
        phone: null,
        latitude: -27.107446728882724,
        longitude: -52.61216236469261
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.647053412937733,
      userLongitude:  -52.260472009887515
    });

    expect(gyms).toHaveLength(4)
    expect(gyms).toEqual([
      expect.objectContaining({title: "Arena Fitness"}),
      expect.objectContaining({title: "Petros Barbell"}),
      expect.objectContaining({title: "Corpus"}),
      expect.objectContaining({title: "Up Fitness"}),
    ])
  })

});
