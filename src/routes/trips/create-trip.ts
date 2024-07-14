import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../lib/prisma";
import { dayjs } from "../../lib/dayjs";
import { getMailClient } from "../../lib/mail";
import nodemailder from "nodemailer";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trip",
    {
      schema: {
        body: z.object({
          destination: z.string().min(3),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          email_to_invite: z.array(z.string().email()),
        }),
      },
    },
    async (request, reply) => {
      const {
        destination,
        ends_at,
        starts_at,
        owner_name,
        owner_email,
        email_to_invite,
      } = request.body;

      const dateNow = new Date();

      if (dayjs(starts_at).isBefore(dateNow)) {
        throw new Error("Trip Not Found");
      }

      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new Error("Trip Not Found");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          ends_at,
          starts_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true
                },
                ...email_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const confirmatLink = `http://localhost:3333/trip/${trip.id}/confirm`;

      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedEndDate = dayjs(ends_at).format("LL");

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "contact@plann.er",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirme sua viagem para ${destination}`,
        html: `
          <div style="display: flex; flex-direction: column; gap: 12px; font-size: 16px">
            <p>
              Você solicitou a criação de uma viagem para
              <strong>${destination}</strong> nas datas de ${formattedStartDate} até ${formattedEndDate}.
            </p>

            <p>Para confirmar sua viagem, clique no link abaixo:</p>

            <a href="${confirmatLink}" style="font-weight: bold">Confirmar</a>

            <p>
              Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.
            </p>

            <div style="display: flex; align-items: center; gap: 4px">
              <img
                src="https://api.scalar.com/cdn/images/f2q6qsAbfvZutgNlD50b6/gdo4Dxn6DWLH0mujTfoax.svg"
                width="24"
                height="24"
                style="filter: invert(100%);"
              />
              <strong style="font-weight: bold">plann.er</strong>
            </div>
          </div>
        `,
      });

      console.log(nodemailder.getTestMessageUrl(message));

      return { trip: trip.id };
    }
  );
}
