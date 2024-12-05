import { prisma } from "@/lib/prisma";
import { CheckIn, Prisma } from "@prisma/client";
import { CheckInRepository } from "../checkin-repository";
import dayjs from "dayjs";


export class PrismaCheckInsRepository implements CheckInRepository{
    async findManyByUser(userId: string, page: number): Promise<CheckIn[]> {
        const checkInsByUser = await prisma.checkIn.findMany({
            where: {
                user_id: userId
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return checkInsByUser
    }
    async countByUser(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId
            }
        })

        return count
    }
    async findById(id: string): Promise<CheckIn | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        })

        return checkIn
    }
    async save(checkIn: CheckIn): Promise<CheckIn> {
        const newCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id
            },
            data: checkIn
        })

        return newCheckIn
    }
    
    
    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkin = await prisma.checkIn.create({
            data,
        })

        return checkin
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {

        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkInOnSameDay = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                }
            }
        })

        if(!checkInOnSameDay){
            return null
        }

        return checkInOnSameDay
    }
}

