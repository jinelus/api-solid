import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Get check-ins history controller (e2e)", () => {
  // Para deixar o app rodando antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Para fechar o app depois de todos os testes
  afterAll(async () => {
    await app.close();
  });

  it("should be able to list the check-ins history", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Gym 01",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

     await prisma.checkIn.createMany({
        data: [
          {
            gym_id: gym.id,
            user_id: user.id,
          },
          {
            gym_id: gym.id,
            user_id: user.id,
          },
          {
            gym_id: gym.id,
            user_id: user.id,
          }
        ],
      });

    const res = await request(app.server)
      .get(`/checkins/history`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.checkIns).toHaveLength(3);
  });
});
