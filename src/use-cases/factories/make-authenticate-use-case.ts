import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AuthentifcateUseCase } from "../authenticate";

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AuthentifcateUseCase(usersRepository);
  return useCase;
}
