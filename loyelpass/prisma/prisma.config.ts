import { defineConfig } from "prisma";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: "npx ts-node prisma/seed.ts",
  },
});
