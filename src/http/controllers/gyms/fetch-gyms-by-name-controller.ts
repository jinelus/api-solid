import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchGymsByNameUseCase } from "@/use-cases/factories/make-fetch-gyms-by-name-use-case";


export async function fetchGymsByNameController (request: FastifyRequest, reply: FastifyReply) {
    
    const createGymBodySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    });

    const { 
        query, 
        page
    } = createGymBodySchema.parse(request.query)

        

    const fetchGymsByNameuseCase = makeFetchGymsByNameUseCase()
    const { gyms } = await fetchGymsByNameuseCase.execute({query, page})



    return reply.status(200).send({
        gyms
    })
}