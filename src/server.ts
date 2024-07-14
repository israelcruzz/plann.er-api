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

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(getTrip);
app.register(createTrip); 
app.register(updateTrip); 

app.register(createLink);
app.register(getTripLinks);

app.listen({ port: 3333 }).then(() => console.log("🚀 Server Running"));
