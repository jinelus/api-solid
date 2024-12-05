import { CheckIn, Prisma } from "@prisma/client";


export interface CheckInRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    findManyByUser(userId: string, page: number): Promise<CheckIn[]>
    countByUser(userId: string): Promise<number>
    findById(id: string): Promise<CheckIn | null>
    save(checkIn: CheckIn): Promise<CheckIn>
}