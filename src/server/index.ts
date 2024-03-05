// https://www.youtube.com/watch?v=qCLV0Iaq9zU&t=42s

import { publicProcedure , router } from './trpc';
//import { z } from 'zod';

export const appRouter = router({
  getTodos: publicProcedure 
    .query( async () => {
      return [10, 20, 30];
    }),
  // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  // getUser: procedure .query(() => {
  //   return { id: '1', name: 'bob' };
  // }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
