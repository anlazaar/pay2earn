import { prisma } from "@/lib/prisma";

type LogLevel = "INFO" | "SUCCESS" | "WARN" | "ERROR";

export const systemLog = async (level: LogLevel, message: string) => {
  void prisma.systemLog
    .create({
      data: {
        level,
        message,
      },
    })
    .catch((e) => {
      console.error("FAILED TO LOG TO DB:", e);
    });
};
