import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { PrismaClient } from "@prisma/client";
import { resolvers } from "../prisma/generated/type-graphql";
import path from "path";

interface Context {
  prisma: PrismaClient;
}

async function main() {
  const schema = await buildSchema({
    resolvers,
    emitSchemaFile: path.resolve(__dirname, "./generated-schema.graphql"),
    validate: false,
  });

  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
  await prisma.$connect();

  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: (): Context => ({ prisma }),
  });
  const { port } = await server.listen(process.env.APOLLO_SERVER_PORT);
  console.log(`GraphQL is listening on http://localhost:${port}/graphql`);
}

main().catch(console.error);
