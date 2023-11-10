import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { options } from '../api/auth/[...nextauth]/options';

async function MembersPage() {
  const session = await getServerSession(options);
  console.log(session);

  if (!session) {
    redirect('/signin?callbackUrl=/members');
  }

  return (
    <div>
      <h1>Member Server Session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
}

export default MembersPage;
