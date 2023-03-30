import { createTRPCRouter } from "~/server/api/trpc";
import { workRouter } from "~/server/api/routers/work";
import { technologiesRouter } from "./routers/technologies";
import { PrismaClient } from "@prisma/client";
import { Session } from "next-auth";

const adapter = new PrismaClient();

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  work: workRouter,
  technologies: technologiesRouter,
});

export function createAPIContext({ ctx }: { ctx: Session | null }) {
  return appRouter.createCaller({
    session: ctx,
    prisma: adapter,
  });
}

// export type definition of API
export type AppRouter = typeof appRouter;
