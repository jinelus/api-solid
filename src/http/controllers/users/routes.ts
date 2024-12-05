import { FastifyInstance } from "fastify";
import { registerController } from "./register-controller";
import { authenticateController } from "./authenticate-controller";
import { profileUserController } from "./profile-controller";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { refreshController } from "./refresh-token-controller";


export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', registerController)
    app.post('/sessions', authenticateController)

    app.patch('/token/refresh', refreshController)

    /* Authenticated */
    app.get('/me', { onRequest: [verifyJWT]}, profileUserController)
}