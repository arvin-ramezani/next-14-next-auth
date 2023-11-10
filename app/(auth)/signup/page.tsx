import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export interface SignUpPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

async function SignUpPage({ searchParams }: SignUpPageProps) {
  const session = await getServerSession();

  const callbackUrl = searchParams.callbackUrl || '/';

  if (session) {
    return redirect(callbackUrl);
  }

  return <div>SignUpPage {callbackUrl}callbackUrl</div>;
}

export default SignUpPage;
