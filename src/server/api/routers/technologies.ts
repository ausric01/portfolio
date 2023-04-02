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

export const technologiesRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().cuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const technologies = await ctx.prisma.technology.findMany({});
        if (technologies) {
          return {
            technologies,
            error: null,
          };
        } else {
          return {
            technologies: null,
            error: "Work not found",
          };
        }
      } catch (e: any) {
        return {
          technologies: null,
          error: e.message,
        };
      }
    }),
  insert: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      try {
        const technology = await ctx.prisma.technology.create({
          data: {
            name,
          },
        });
        if (technology) {
          return {
            technology,
            error: null,
          };
        } else {
          return {
            technology: null,
            error: "Technology failed to create",
          };
        }
      } catch (e: any) {
        return {
          technology: null,
          error: e.message,
        };
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const technology = await ctx.prisma.technology.delete({
          where: {
            id,
          },
        });
        if (technology) {
          return {
            technology,
            error: null,
          };
        } else {
          return {
            technology: null,
            error: "Failed to delete technology",
          };
        }
      } catch (e: any) {
        return {
          technology: null,
          error: e.message,
        };
      }
    }),
});
