import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const messageRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      select: {
        text: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            wallet: true,
          },
        },
      },
    });
  }),
  insertMessge: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.message.create({
        data: {
          text: input.text,
          userId: ctx.session.user.id,
        },
      });
    }),
});
