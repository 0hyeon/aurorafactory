import { logout } from '@/lib/session';
import { Suspense } from 'react';
import { Loading, Username } from './components';


const Profile = async () => {
  return (
    <div className='flex gap-5 items-center justify-center'>
      <Suspense fallback={<Loading />}>
        <Username />
      </Suspense>
      <form action={logout}>
        <button>Log out</button>
      </form>
    </div>
  );
};

export default Profile;