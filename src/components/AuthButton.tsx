import useAuth from '../hooks/useAuth';
import clsx from 'clsx';

const AuthButton: React.FC = () => {
  const { signIn, signOut, loggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className={clsx(
          'rounded bg-white/10 px-10 py-3',
          'font-semibold text-white no-underline transition hover:bg-white/20',
        )}
        onClick={() => (loggedIn ? signOut() : signIn())}
      >
        {loggedIn ? <div>Sign Out</div> : <div>Sign In</div>}
      </button>
    </div>
  );
};

export default AuthButton;
