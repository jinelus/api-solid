import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate check-ins controller (e2e)", () => {
  // Para deixar o app rodando antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Para fechar o app depois de todos os testes
  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Gym 01",
        latitude: -27.2092052,
        longitude: -49.6401091,
      },
    });

    let checkIn = await prisma.checkIn.create({
        data: 
          {
            gym_id: gym.id,
            user_id: user.id,
          },
    })

    const res = await request(app.server)
      .patch(`/checkins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send()

    expect(res.statusCode).toEqual(204)

    checkIn = await prisma.checkIn.findUniqueOrThrow({
        where: 
          {
            id: checkIn.id
          },
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  });
});
