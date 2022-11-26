import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import cookie from 'cookie';

import { prisma } from '../db/client';

type CreateContextOptions = {
  session: User | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

// function parseCookies(str: string) {
//   const res: Record<string, string> = {};
//   const cookies = str.split('; ');
//   cookies.map(cookie => {
//     const [key, value] = cookie.split('=');
//     res[key ?? ''] = value ?? '';
//   });

//   return res;
// }

async function decodeCookiesAndGetUser(cookies: string) {
  const parsedCookies = cookie.parse(cookies);
  const authCookie = parsedCookies['auth'];
  if (authCookie == null) {
    return null;
  }
  const jwtData = jwt.verify(authCookie, process.env.JWT_SECRET!) as any;

  return await prisma.user.findUnique({
    where: {
      wallet: jwtData.publicKey,
    },
  });
}

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const cookies = req.headers.cookie ?? '';
  const user = await decodeCookiesAndGetUser(cookies);

  return await createContextInner({
    session: user,
  });
};

export type Context = inferAsyncReturnType<typeof createContext>;
