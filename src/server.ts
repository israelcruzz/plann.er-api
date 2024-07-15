import fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createTrip } from "./routes/trips/create-trip";
import { createLink } from "./routes/links/create-link";
import { getTripLinks } from "./routes/links/get-trip-links";
import { getTrip } from "./routes/trips/get-trip";
import { updateTrip } from "./routes/trips/update-trip";
import { confirmTrip } from "./routes/trips/confirm-trip";
import { getTripParticipants } from "./routes/participants/get-trip-participants";
import { confirmParticipant } from "./routes/participants/confirm-participant";
import { inviteParticipant } from "./routes/participants/invite-participant";
import { getTripActivities } from "./routes/activities/get-trip-activities";
import { createActivity } from "./routes/activities/create-activitie";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getTrip);
app.register(createTrip);
app.register(updateTrip);
app.register(confirmTrip);

app.register(getTripParticipants);
app.register(confirmParticipant);
app.register(inviteParticipant);

app.register(createLink);
app.register(getTripLinks);

app.register(createActivity);
app.register(getTripActivities);

app.listen({ port: 3333 }).then(() => console.log("🚀 Server Running"));
