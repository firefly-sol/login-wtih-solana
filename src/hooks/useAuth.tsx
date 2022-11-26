import { parseCookies } from 'nookies';
import { atom, useAtom } from 'jotai';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import * as bs58 from 'bs58';

export function expireCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;domain=localhost`;
}

const cookies = parseCookies();
const auth = cookies['auth'];
const loggedInAtom = atom<boolean>(auth != null);

export default function useAuth() {
  const [loggedIn, setLoggedIn] = useAtom(loggedInAtom);
  const { publicKey, signMessage } = useWallet();

  const signIn = async () => {
    if (publicKey != null) {
      const nonce = await (await axios.get('/api/auth/nonce')).data.nonce;

      const message = `Sign this message to authenticate with your wallet. Nonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      if (signMessage) {
        const signedMessage = await signMessage(encodedMessage);
        const signature = bs58.encode(signedMessage);

        await axios.post('/api/auth', {
          publicKey: publicKey.toString(),
          signature,
        });
        setLoggedIn(true);
      }
    }
  };

  const signOut = () => {
    expireCookie('auth');
    setLoggedIn(false);
  };

  return { signIn, signOut, loggedIn };
}
