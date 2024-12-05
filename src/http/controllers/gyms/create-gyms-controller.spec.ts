import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user"


describe("Create Gyms controller (e2e)", () => {

    // Para deixar o app rodando antes de todos os testes
    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to create a gym", async () => {

        const {token} = await createAndAuthenticateUser(app, true)

        const res = await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Gym 01',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        expect(res.statusCode).toEqual(201)
    })
})