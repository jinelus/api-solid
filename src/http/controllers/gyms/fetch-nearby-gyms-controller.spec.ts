import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/http/utils/test/create-and-authenticate-user";

describe("Nearby Gyms controller (e2e)", () => {
  // Para deixar o app rodando antes de todos os testes
  beforeAll(async () => {
    await app.ready();
  });

  // Para fechar o app depois de todos os testes
  afterAll(async () => {
    await app.close();
  });

  it("should be able to fetch nearby a gym", async () => {

    const {token} = await createAndAuthenticateUser(app, true)

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Arena Fitness",
      description: null,
      phone: null,
      latitude: -27.641586145391827,
      longitude: -52.2628332753904,
    });

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Petros Barbell",
      description: null,
      phone: null,
      latitude: -27.495430330856607,
      longitude: -51.899102194137086
    });

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Corpus",
      description: null,
      phone: null,
      latitude: -27.643571742214238,
      longitude: -52.26823217912048,
    });

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Up Fitness",
      description: null,
      phone: null,
      latitude: -27.639303822905987,
      longitude: -52.23685447110892,
    });

    await request(app.server).post("/gyms")
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: "Chapeco Fitness",
      description: null,
      phone: null,
      latitude: -27.107446728882724,
      longitude: -52.61216236469261,
    });

    const res = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -27.647293914528607, longitude: -52.260503184978475 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(res.statusCode).toEqual(200);
    expect(res.body.gyms).toHaveLength(3)
    expect(res.body.gyms).toEqual([
        expect.objectContaining({title: "Arena Fitness"}),
        expect.objectContaining({title: "Corpus"}),
        expect.objectContaining({title: "Up Fitness"}),
      ])
  });
});
