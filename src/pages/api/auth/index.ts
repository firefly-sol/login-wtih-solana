import { type NextApiRequest, type NextApiResponse } from 'next';
import * as z from 'zod';
import * as bs58 from 'bs58';
import nacl from 'tweetnacl';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../server/db/client';
import cookie from 'cookie';

export function daysToSec(days: number) {
  return days * 24 * 60 * 60;
}

async function initOrGetUser(publicKey: string) {
  const userQuery = await prisma.user.findUnique({
    where: {
      wallet: publicKey,
    },
  });
  if (userQuery != null) {
    return userQuery;
  }
  return await prisma.user.create({
    data: {
      wallet: publicKey,
    },
  });
}

const reqSchema = z.object({
  publicKey: z.string(),
  signature: z.string(),
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'POST': {
      const { publicKey, signature } = reqSchema.parse(req.body);
      const nonce = z.string().parse(req.cookies['nonce']);
      const message = `Sign this message to authenticate with your wallet. Nonce: ${nonce}`;

      const messageBytes = new TextEncoder().encode(message);

      const publicKeyBytes = bs58.decode(publicKey);
      const signatureBytes = bs58.decode(signature);

      const result = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes,
      );

      if (result) {
        const user = await initOrGetUser(publicKey);
        const expSeconds = daysToSec(3);
        const expireDate = new Date(new Date().getTime() + expSeconds * 1000);
        const tokenData = { id: user.id, publicKey, expSeconds };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET ?? '');

        const cookieOptions = {
          expires: expireDate,
          maxAge: expireDate.getTime() - Date.now() / 1000,
          path: '/',
        };

        res.setHeader('Set-Cookie', [
          cookie.serialize('auth', token, cookieOptions),
          'nonce=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT',
        ]);
        await prisma.session.create({
          data: {
            sessionToken: token,
            userId: user.id,
            expires: expireDate,
          },
        });

        return res.status(200).send({
          message: 'Authentication succeeded',
        });
      }
      return res.status(400).send({ message: 'Incorrect signature' });
    }
    default: {
      res.setHeader('Allow', ['GET']);
      return res.status(405).send({
        message: `Method ${method} Not Allowed`,
      });
    }
  }
};

export default handler;
