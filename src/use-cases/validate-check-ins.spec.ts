import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ValidateCheckInUseCase } from "./validate-check-ins";
import { RessourceNotFoundError } from "./errors/ressource-not-found-error";
import { InvalidateError } from "./errors/invalidate-checkin-error";


let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe("Validate check-in use case", () => {

    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInRepository);

        // Do a Morking
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to validate check-in", async () => {
        const createdCheckIn = await checkInRepository.create({
            gym_id: "gym-01",
            user_id: "user-01",
        });

        const {checkIn} = await sut.execute({
            checkInId: createdCheckIn.id
        })
        
        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
    })

    it("should be able to validate a inexistent check-in", async () => {
        await expect(sut.execute({
            checkInId: "inexistent-check-in-id"
        })).rejects.toBeInstanceOf(RessourceNotFoundError)
    })

    it("should not be able to validate the check-in before 20 minutes of creation", async () => {
        vi.setSystemTime(new Date(2024, 0, 20, 16, 20, 40))
        const createdCheckIn = await checkInRepository.create({
            gym_id: "gym-01",
            user_id: "user-01",
        })

        vi.advanceTimersByTime(1000 * 60 * 21)
        
        await expect(sut.execute({
            checkInId: createdCheckIn.id
        })).rejects.toBeInstanceOf(InvalidateError)
    })
});