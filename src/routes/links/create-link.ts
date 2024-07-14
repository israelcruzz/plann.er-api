import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trip/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string(),
          url: z.string(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, url } = request.body;

      const findTripWithSameId = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!findTripWithSameId || !findTripWithSameId.is_confirmed) {
        throw new Error("Trip Not Found");
      }

      const link = await prisma.link.create({
        data: {
          title,
          url,
          tripId,
        },
      });

      return { link: link.id };
    }
  );
}
