import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participant/:participantId",
    {
      schema: {
        params: z.object({
          participantId: z.string(),
        }),
      },
    },
    async (request) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      });

      if (!participant) {
        throw new Error("Trip Not Found");
      }

      return { participant }
    }
  );
}
