import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"


describe("Register controller (e2e)", () => {

    // Para deixar o app rodando antes de todos os testes
    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to register", async () => {
        const res = await request(app.server)
        .post('/users')
        .send({
            name: 'The One',
            email: 'theone@gmail.com',
            password: '123456789'
        })

        expect(res.statusCode).toEqual(201)
    })
})