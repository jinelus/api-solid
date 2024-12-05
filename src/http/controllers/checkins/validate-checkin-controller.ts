import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeValidateCheckinUseCase } from "@/use-cases/factories/make-validate-checkin-use-case";

export async function validateCheckinsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });


  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  const validateCheckinUseCase = makeValidateCheckinUseCase();

  await validateCheckinUseCase.execute({
    checkInId
  });

  return reply.status(204).send();
}
