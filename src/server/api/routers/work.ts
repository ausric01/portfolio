/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const workRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const work = await ctx.prisma.work.findMany({});
        if (work) {
          return {
            work,
            error: null,
          };
        } else {
          return {
            work: null,
            error: "Work not found",
          };
        }
      } catch (e: any) {
        return {
          work: null,
          error: e.message,
        };
      }
    }),
});
