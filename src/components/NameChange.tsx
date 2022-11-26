import clsx from 'clsx';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { trpc } from '../utils/trpc';

export default function NameChange() {
  const utils = trpc.useContext();
  const [name, setName] = useState<string>('');
  const changeNameMutation = trpc.user.changeName.useMutation();

  const { loggedIn } = useAuth();

  const handleChangeName = async () => {
    if (name.length < 5) {
      return;
    }
    await changeNameMutation.mutateAsync({ name });
    setName('');
    utils.message.getAll.invalidate();
  };

  return (
    <>
      <input
        placeholder="New name"
        className={clsx('bg-slate-800 text-white p-3 rounded')}
        name={name}
        onChange={evt => setName(evt.target.value)}
      />
      <button
        className={clsx(
          'bg-slate-800 text-white',
          'px-10',
          !loggedIn && 'cursor-not-allowed',
          'py-3 rounded',
        )}
        onClick={handleChangeName}
        disabled={!loggedIn}
      >
        Change Name
      </button>
    </>
  );
}
