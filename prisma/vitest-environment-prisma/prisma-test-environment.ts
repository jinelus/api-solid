import 'dotenv/config'
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { Environment } from "vitest";

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string){

    if(!process.env.DATABASE_URL){
        throw new Error("Please provide a DATABASE_URL environment variable.")
    }

    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set("schema", schema)

    return url.toString()
}

export default <Environment>{
    name: 'prisma',
    transformMode: 'web',
    setup() {
      const schema = randomUUID()

      const newDatabaseURL = generateDatabaseURL(schema)
      process.env.DATABASE_URL = newDatabaseURL

      execSync("npx prisma migrate deploy")

      return {
        async teardown() {
          await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
          await prisma.$disconnect()
        }
      }
    }
  }