/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";
import fs from "fs";

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
        const work = await ctx.prisma.work.findMany({
          include: {
            technologies: true,
          },
        });
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
  insert: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        technologies: z.array(z.string().cuid()),
        fileName: z.string(),
        base64String: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, description, technologies, fileName, base64String } =
        input as {
          title: string;
          description: string;
          technologies: string[];
          fileName: string;
          base64String: string;
        };
      try {
        //remove context
        const base64Data = base64String.replace(
          /^data:image\/(png|jpg|jpeg);base64,/,
          ""
        );
        //write the file to the dir
        const buffer = Buffer.from(base64Data, "base64");
        fs.writeFileSync(`./public/work/${fileName}`, buffer);

        const work = await ctx.prisma.work.create({
          data: {
            title,
            description,
            technologies: {
              connect: technologies.map((id) => ({ id })),
            },
            image: fileName,
          },
        });
        if (work) {
          return {
            work,
            error: null,
          };
        } else {
          return {
            work: null,
            error: "Error creating Work",
          };
        }
      } catch (e) {
        return {
          error: e,
        };
      }
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;
      try {
        const work = await ctx.prisma.work.delete({
          where: {
            id,
          },
        });
        if (work) {
          fs.unlinkSync(`./public/work/${work.image ?? ""}`);
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
