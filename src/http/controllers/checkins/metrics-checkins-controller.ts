import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUSerMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";


export async function metricsCheckinsUserController (request: FastifyRequest, reply: FastifyReply) {
    const fetchUserHistoryCheckinsUseCase = makeGetUSerMetricsUseCase()
    const { checkInsCount } = await fetchUserHistoryCheckinsUseCase.execute({userId: request.user.sub})

    return reply.status(200).send({
        count: checkInsCount
    })
}