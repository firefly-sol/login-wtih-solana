import clsx from 'clsx';
import { useState } from 'react';
import { trpc } from '../utils/trpc';

export default function MessageInput() {
  const [text, setText] = useState<string>('');
  const utils = trpc.useContext();
  const insertMessage = trpc.message.insertMessge.useMutation();
  return (
    <div
      className={clsx('flex flex-row justify-between', 'w-full', 'space-x-6')}
    >
      <textarea
        placeholder="Write a message..."
        value={text}
        onChange={evt => setText(evt.target.value)}
        className={clsx(
          'w-full bg-slate-800 p-4',
          'resize-none rounded',
          'text-white',
        )}
      />
      <button
        className={clsx(
          'w-[200px] rounded bg-slate-800',
          'flex flex-col items-center justify-center',
          'text-white',
        )}
        onClick={async () => {
          if (text === '') {
            return;
          }
          await insertMessage.mutateAsync({ text });
          setText('');
          utils.message.invalidate();
        }}
      >
        Send
      </button>
      <button
        className={clsx(
          'w-[200px] rounded bg-slate-800',
          'flex flex-col items-center justify-center',
          'text-white',
        )}
        onClick={async () => {
          await insertMessage.mutateAsync({ text: 'gm' });
          utils.message.getAll.invalidate();
        }}
      >
        gm
      </button>
    </div>
  );
}
