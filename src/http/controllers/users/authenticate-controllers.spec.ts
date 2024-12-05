import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Authenticate controller (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to authenticate", async () => {

        // Para criar um usuário
        await request(app.server)
        .post('/users')
        .send({
            name: 'The One',
            email: 'theone@gmail.com',
            password: '123456789'
        })

        const res = await request(app.server)
        .post('/sessions')
        .send({
            email: 'theone@gmail.com',
            password: '123456789'
        })

        expect(res.statusCode).toEqual(200)
        expect(res.body).toEqual({
            token: expect.any(String)
        })
    })

})