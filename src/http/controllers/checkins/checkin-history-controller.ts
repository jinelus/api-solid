import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";


export async function checkInsHistoryController (request: FastifyRequest, reply: FastifyReply) {
    
    const checkInsHistorySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    });

    const {  
        page
    } = checkInsHistorySchema.parse(request.query)

    const fetchUserHistoryCheckinsUseCase = makeFetchUserCheckInsHistoryUseCase()
    const { checkIns } = await fetchUserHistoryCheckinsUseCase.execute({userId: request.user.sub, page})



    return reply.status(200).send({
        checkIns
    })
}