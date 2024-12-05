import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckInUseCase } from "./checkin";
import { AlreadyCheckingError } from "./errors/already-check-in-error";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memrory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInRepository, gymRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    gymRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.6718647,
      longitude: -52.2868655,
    })

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -27.6718647,
      userLongitude: -52.2868655,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to chechk in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    gymRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.6718647,
      longitude: -52.2868655,
    })

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.6718647,
      userLongitude: -52.2868655,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.6718647,
        userLongitude: -52.2868655,
      })
    ).rejects.toBeInstanceOf(AlreadyCheckingError);
  });

  it("should be able to chechk in twice in different day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    gymRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.6718647,
      longitude: -52.2868655,
    })

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.6718647,
      userLongitude: -52.2868655,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -27.6718647,
      userLongitude: -52.2868655,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {

    gymRepository.create({
      id: "gym-01",
      title: "JavaScript Gym",
      description: "",
      phone: "",
      latitude: -27.6718647,
      longitude: -52.2868655,
    })

    await expect(() => sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -27.646441427694132,
        userLongitude: -52.26827328779327,
      })).rejects.toBeInstanceOf(Error);
  });

  // it('should be able to get check in', async () => {

  //     const createdCheckIn = await checkInRepository.create({
  //         user_id: 'user-01',
  //         gym_id: 'gym-01',
  //         created_at: new Date(),
  //     })

  //     const { checkIn } = await sut.execute({
  //         userId: createdCheckIn.user_id,
  //         gymId:  createdCheckIn.gym_id
  //     })

  //     expect(checkIn.id).toEqual(expect.any(String))
  // })
});
