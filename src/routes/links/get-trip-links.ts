import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getTripLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trip/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;

      const findTripWithSameId = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!findTripWithSameId) {
        throw new Error("Trip Not Found");
      }

      if (!findTripWithSameId.is_confirmed) {
        throw new Error("Trip Not Found");
      }

      const links = await prisma.link.findMany({
        where: {
          tripId,
        },
      });

      return links 
    }
  );
}
