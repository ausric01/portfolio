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
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const work = await ctx.prisma.work.findUnique({
          where: {
            id,
          },
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
  edit: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        title: z.string(),
        description: z.string(),
        technologies: z.array(z.string().cuid()),
        filePath: z.string().optional(),
        fileName: z.string().optional(),
        base64String: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        id,
        title,
        description,
        technologies,
        filePath,
        fileName,
        base64String,
      } = input;

      try {
        //If the Image exists update the other fields, else update everything
        //including adding the image to the public/work folder
        if (filePath) {
          const work = await ctx.prisma.work.update({
            where: {
              id,
            },
            data: {
              title,
              description,
              technologies: {
                connect: technologies.map((id) => ({ id })),
              },
              image: filePath,
            },
          });
          if (work) {
            return {
              work,
              error: null,
            };
          }
          return {
            work: null,
            error: "Error updating Work",
          };
        } else if (base64String && fileName) {
          const base64Data = base64String.replace(
            /^data:image\/(png|jpg|jpeg);base64,/,
            ""
          );
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(`./public/work/${fileName}`, buffer);

          const work = await ctx.prisma.work.update({
            where: {
              id,
            },
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
          }
          return {
            work: null,
            error: "Error updating Work",
          };
        } else {
          return {
            work: null,
            error: "Invalid input parameters",
          };
        }
      } catch (e: any) {}
    }),
});
