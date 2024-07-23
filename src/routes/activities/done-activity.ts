import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function doneActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/activity/:activityId/done",
    {
      schema: {
        params: z.object({
          activityId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { activityId } = request.params;

      const activity = await prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

      if (!activity) {
        throw new Error("Activity Not Found");
      }

      await prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          done: true,
        },
      });

      return { activityId };
    }
  );
}
