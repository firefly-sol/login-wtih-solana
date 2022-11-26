import clsx from 'clsx';
import CondensedMessage from './CondensedMessage';
import { trpc } from '../utils/trpc';
import { RouterOutputs } from '../utils/trpc';

export type MessageGetAllArray = RouterOutputs['message']['getAll'];

export type MessageType = {
  text: string;
  name: string;
  time: string;
};

export type CondensedMessageType = {
  name: string;
  messages: MessageGetAllArray;
};

function condenseMessages(
  messages: MessageGetAllArray,
): Array<CondensedMessageType> {
  const res: Array<CondensedMessageType> = [];
  for (const message of messages) {
    if (res.length === 0 || message.user.wallet !== res[res.length - 1]?.name) {
      res.push({ name: message.user.wallet, messages: [message] });
    } else {
      res[res.length - 1]?.messages.push(message);
    }
  }

  return res;
}

export default function MessageList() {
  const messages = trpc.message.getAll.useQuery(undefined, {
    refetchInterval: 10000,
  });

  const condensedMessages = condenseMessages(messages.data ?? []);
  return (
    <div
      className={clsx(
        'flex flex-col space-y-6',
        'w-full',
        'h-800px overflow-y-auto',
        'py-6',
      )}
    >
      {condensedMessages.map(({ name, messages }, i) => (
        <CondensedMessage key={name + '`' + i} messages={messages} />
      ))}
    </div>
  );
}
