import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import crypto from 'crypto';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      const nonce = crypto.randomBytes(32).toString('base64');
      res
        .status(200)
        .setHeader(
          'Set-Cookie',
          cookie.serialize('nonce', nonce, { path: '/' }),
        );

      return res.json({ nonce });
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).send({ message: `Method ${method} Not Allowed` });
  }
};

export default handler;
