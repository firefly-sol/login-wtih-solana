import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

export const userRouter = router({
  changeName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        data: {
          name: input.name,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
