import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";


export async function fetchNearbyGymsController (request: FastifyRequest, reply: FastifyReply) {
    
    const createGymBodySchema = z.object({
        latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine(value => Math.abs(value) <= 180)
    });

    const { 
        latitude,
        longitude
    } = createGymBodySchema.parse(request.query)

        

    const fetchNeearbyGymUseCase = makeFetchNearbyGymsUseCase()
    const { gyms } = await fetchNeearbyGymUseCase.execute({userLatitude: latitude, userLongitude: longitude})

    return reply.status(200).send({
        gyms
    })
}