'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
function ClientMembersPage() {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/signin?callbackUrl=/client-members');
      // redirect("/api/auth/signin?callbackUrl=/client-members");
    },
  });

  return (
    <div>
      <h1>Member Client Session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </div>
  );
}

export default ClientMembersPage;
