import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create check-in controller (e2e)", () => {
  // Para deixar o app rodando antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Para fechar o app depois de todos os testes
  afterAll(async () => {
    await app.close();
  });

  it("should be able to do check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Gym 01",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    const res = await request(app.server)
      .post(`/gyms/${gym.id}/checkins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    expect(res.statusCode).toEqual(201);
  });
});
