import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCreateGymUseCase } from "@/use-cases/factories/make-create-gym-use-case";


export async function createGymController (request: FastifyRequest, reply: FastifyReply) {
    
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => Math.abs(value) <= 90),
        longitude: z.number().refine(value => Math.abs(value) <= 180),
    });

    const { latitude, 
        longitude, 
        title, 
        description, 
        phone 
    } = createGymBodySchema.parse(request.body)

        
    const createGymuseCase = makeCreateGymUseCase()

    await createGymuseCase.execute({title, description, phone, latitude, longitude})


    return reply.status(201).send()
}