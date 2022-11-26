import { router } from '../trpc';
import { messageRouter } from './message';
import { userRouter } from './user';

export const appRouter = router({
  message: messageRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
