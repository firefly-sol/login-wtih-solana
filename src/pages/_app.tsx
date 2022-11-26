import { type AppType } from 'next/app';
import dynamic from 'next/dynamic';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';

const WalletProvider = dynamic(
  () => import('../contexts/ClientWalletProvider'),
  {
    ssr: false,
  },
);


const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
};

export default trpc.withTRPC(MyApp);
