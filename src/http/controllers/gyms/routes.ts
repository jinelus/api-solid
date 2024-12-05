import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { createGymController } from "./create-gym-controller";
import { fetchGymsByNameController } from "./fetch-gyms-by-name-controller";
import { fetchNearbyGymsController } from "./fetch-nearby-gyms-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";


export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/gyms', {preHandler: [verifyUserRole('ADMIN')]} , createGymController)
    app.get('/gyms/search', fetchGymsByNameController)
    app.get('/gyms/nearby', fetchNearbyGymsController)
}