import { type NextPage } from 'next';
import Head from 'next/head';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import clsx from 'clsx';
import NameChange from '../components/NameChange';
import AuthButton from '../components/AuthButton';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>gmchat</title>
        <meta name="description" content="Chat with your web3 friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className={clsx('relative w-full')}>
          <h1 className="text-5xl font-extrabold text-slate-500 md:text-[5rem]">
            <span className="text-purple-300">gm</span>chat
          </h1>
          <div
            className={clsx(
              'absolute right-0 bottom-0',
              'flex flex-row items-center space-x-4',
            )}
          >
            <WalletMultiButton />
            <AuthButton />
            <NameChange />
          </div>
        </div>
        <MessageList />
        <MessageInput />
      </main>
    </>
  );
};

export default Home;
