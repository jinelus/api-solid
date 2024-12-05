import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { RessourceNotFoundError } from "@/use-cases/errors/ressource-not-found-error";


export async function profileUserController (request: FastifyRequest, reply: FastifyReply) {
    const id  = request.user.sub

    try {
        const getProfileUseCase = makeGetUserProfileUseCase()

        const {user} = await getProfileUseCase.execute({userId: id})
        return reply.status(200).send({ 
            user: {
                ...user,
                password_hash: undefined
            }
         })
    } catch (error) {
        if(error instanceof RessourceNotFoundError){
            return reply.status(409).send({message: error.message})
        }

        throw error //TODD: Tratar erros
    }

}