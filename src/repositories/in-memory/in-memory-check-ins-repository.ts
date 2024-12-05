import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../checkin-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";


export class InMemoryCheckInsRepository implements CheckInRepository{
    
    public checkIns: CheckIn[] = []
    
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {

        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            created_at: new Date(),
            validated_at: data.validated_at ? new Date() : null
        }

        this.checkIns.push(checkIn)

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {

        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDay = this.checkIns.find(item => {
            const checkInDate = dayjs(item.created_at)
            const isOnSameDay = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return item.user_id === userId && isOnSameDay
        })

        if(!checkInOnSameDay){
            return null
        }

        return checkInOnSameDay
    }

    async findManyByUser(userId: string, page: number): Promise<CheckIn[]> {
        const checkIns = this.checkIns.filter(checkIn => checkIn.user_id === userId)
                         .slice((page - 1) * 20, page * 20)

        return checkIns
    }

    async countByUser(userId: string): Promise<number> {
        const length = this.checkIns.filter(checkIn => checkIn.user_id === userId).length;

        return length
    }

    async findById(id: string): Promise<CheckIn | null> {    
        return this.checkIns.find(checkIn => checkIn.id === id) || null
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.checkIns.findIndex(item => item.id === checkIn.id)

        if(checkInIndex >= 0){
            this.checkIns[checkInIndex] = checkIn
        }

        return checkIn
    }

}

