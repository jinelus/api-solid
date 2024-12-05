import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user"

describe("Profile controller (e2e)", () => {

    // Para deixar o app rodando antes de todos os testes
    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to get user's profile", async () => {
        
        const {token} = await createAndAuthenticateUser(app)

        const responseProfile = await request(app.server)
        .get('/me')
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(responseProfile.statusCode).toEqual(200)
        expect(responseProfile.body.user).toEqual(expect.objectContaining({
            email: 'theone@gmail.com'
        }))
    })
})