import { FastifyInstance } from "fastify";
import { verifyJWT } from "../../middlewares/verify-jwt";
import { checkinsController } from "./check-in-controller";
import { metricsCheckinsUserController } from "./metrics-checkins-controller";
import { checkInsHistoryController } from "./checkin-history-controller";
import { validateCheckinsController } from "./validate-checkin-controller";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";


export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/gyms/:gymId/checkins', checkinsController)
    app.get('/checkins/metrics', metricsCheckinsUserController)
    app.get('/checkins/history', checkInsHistoryController)
    app.patch('/checkins/:checkInId/validate', { preHandler: [verifyUserRole('ADMIN')]} ,validateCheckinsController)

}