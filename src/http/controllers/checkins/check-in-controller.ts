import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeCheckinsUseCAse } from "@/use-cases/factories/make-check-ins-use-case";

export async function checkinsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const checkinSchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  });

  const createCheckInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  });

  const { latitude, longitude } = checkinSchema.parse(request.body);

  const { gymId } = createCheckInsParamsSchema.parse(request.params);

  const userId = request.user.sub

  const checkinUseCase = makeCheckinsUseCAse();

  await checkinUseCase.execute({
    gymId,
    userId,
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(201).send();
}
