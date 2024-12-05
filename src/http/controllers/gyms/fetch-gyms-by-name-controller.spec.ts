import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user"


describe("Fetch Gyms by name controller (e2e)", () => {

    // Para deixar o app rodando antes de todos os testes
    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to fetch gym by name", async () => {

        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Gym 01',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Gym 02',
            description: null,
            phone: null,
            latitude: -27.2092052,
            longitude: -49.6401091
        })

        await request(app.server)
        .post('/gyms')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Gym 01',
            description: null,
            phone: null,
            latitude: -26.2092052,
            longitude: -49.6401091
        })

        const res = await request(app.server)
        .get('/gyms/search')
        .query({
            query: 'Gym 01'
        })
        .set('Authorization', `Bearer ${token}`)
        .send()

        expect(res.statusCode).toEqual(200)
        expect(res.body.gyms).toHaveLength(2)
    })
})