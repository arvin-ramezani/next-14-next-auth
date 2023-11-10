import Link from 'next/link';
import { getServerSession } from 'next-auth';

import { options } from '../api/auth/[...nextauth]/options';

const Nav = async () => {
  const session = await getServerSession(options);

  return (
    <header className='bg-gray-600 text-gray-100'>
      <nav className='flex justify-between items-center w-full px-10 py-4'>
        <div className='font-bold text-2xl'>My Site</div>
        <div className='flex gap-10 text-sm lg:text-lg'>
          <Link href='/'>Home</Link>
          <Link href='/create-user'>Create User</Link>
          <Link href='/client-members'>Client Member</Link>
          <Link href='/members'>Member</Link>
          <Link href='/public'>Public</Link>
          {session ? (
            <Link href='/api/auth/signout?callbackUrl=/'>Signout</Link>
          ) : (
            <Link href='/signin'>Signin</Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
