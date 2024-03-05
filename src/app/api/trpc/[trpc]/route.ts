import { fetchRequestHandler } from "@trpc/server/adapters/fetch";


//import { appRouter } from "@/server"
//import { appRouter } from "../../../../server/index"  // XXX hmmmm
import { appRouter } from "@/src/server";


const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
  
  export {handler as GET, handler as POST };
  