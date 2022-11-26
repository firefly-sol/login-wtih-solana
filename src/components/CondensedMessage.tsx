import clsx from 'clsx';
import type { MessageGetAllArray } from './MessageList';

enum MessageShape {
  ROUNDED_TOP,
  ROUNDED_BOTTOM,
  FLAT_LEFT,
}

const linkRegex =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

interface CondensedMessageProps {
  messages: MessageGetAllArray;
}

export default function CondensedMessage({ messages }: CondensedMessageProps) {
  const name = (messages[0]?.user.name ?? messages[0]?.user.wallet)!;
  const time = messages[0]?.createdAt.toLocaleTimeString() ?? '12:45';
  return (
    <div
      className={clsx(
        'flex flex-col w-full',
        'rounded-lg bg-slate-800',
        'px-4',
        'py-2',
      )}
    >
      <div className={clsx('w-full flex flex-row justify-between')}>
        <p className={clsx('text-blue-400')}>{name}</p>
        <p className={clsx('text-slate-500')}>{time}</p>
      </div>
      {messages.map((message, i) => (
        <InnerMessage
          key={'name' + '`' + message.text + '`' + time + '`' + i}
          name={name}
          text={message.text}
          time={time}
          shape={
            i === 0
              ? MessageShape.ROUNDED_TOP
              : i === messages.length - 1
                ? MessageShape.ROUNDED_BOTTOM
                : MessageShape.FLAT_LEFT
          }
        />
      ))}
    </div>
  );
}

interface InnerMessageProps {
  name: string;
  text: string;
  time: string;
  shape: MessageShape;
}

function InnerMessage({ text }: InnerMessageProps) {
  const isLink = linkRegex.test(text);
  return (
    <div className={clsx('w-full ', 'py-1')}>
      <p className={clsx('text-slate-300')}>
        {isLink ? (
          <a
            className={clsx('text-blue underline')}
            href={text}
            target="_blank"
            rel="noreferrer"
          >
            {text}
          </a>
        ) : (
          text
        )}
      </p>
    </div>
  );
}
