import { CheckIn, Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { getDistanceBetweenCoordinate } from "@/use-cases/utils/get-distance-between-coordinate";


export class InMemoryGymsRepository implements GymsRepository{
    
    public gyms: Gym[] = []
    
    async create(data: Prisma.GymCreateInput): Promise<Gym> {

        const gym = {
            id: data.id ?? randomUUID(),
            title:  data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
        }

        this.gyms.push(gym)

        return gym
    }

    async findById(gymId: string): Promise<Gym | null> {
        const gymFound = this.gyms.find(item => item.id === gymId)

        if(!gymFound){
            return null
        }

        return gymFound
    }

    async findByName(query: string, page: number): Promise<Gym[]> {
        const gymsFound = this.gyms.filter(item => item.title.includes(query)) 
                            .slice((page - 1) * 20, page * 20)

        return gymsFound
    }

    async findManyNearby({latitude, longitude}: FindManyNearbyParams): Promise<Gym[]> {
        const gymsFound = this.gyms.filter(item => {
            const distance = getDistanceBetweenCoordinate(
                { latitude, longitude },
                { latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber() }
            )

            return distance < 10
        })

        return gymsFound
    }

}

