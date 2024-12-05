import request from "supertest"
import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

describe("Refresh token controller (e2e)", () => {

    beforeAll(async () => {
        await app.ready()
    })

    // Para fechar o app depois de todos os testes
    afterAll(async () => {
        await app.close()
    })

    it("should be able to refresh a token", async () => {

        // Para criar um usuário
        await request(app.server)
        .post('/users')
        .send({
            name: 'The One',
            email: 'theone@gmail.com',
            password: '123456789'
        })

        const authResponse = await request(app.server)
        .post('/sessions')
        .send({
            email: 'theone@gmail.com',
            password: '123456789'
        })

        const cookies = authResponse.get('Set-Cookie')

        const response = await request(app.server)
        .patch('/token/refresh')
        .set('Cookie', cookies || [])
        .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual({
            token: expect.any(String)
        })
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ])
    })

})