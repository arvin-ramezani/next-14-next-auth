'use client';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import SignInForm from '@/app/(components)/signin-form';
import { useEffect } from 'react';

export interface SignInPageProps {
  searchParams: {
    callbackUrl?: string;
  };
}

const authProviders = {
  github: 'github',
  google: 'google',
};

function SignInPage({ searchParams }: SignInPageProps) {
  const router = useRouter();
  const { data, status } = useSession();

  const callbackUrl = searchParams.callbackUrl || '/';

  // if (status === 'authenticated') {
  //   return router.replace(callbackUrl);
  // }

  const signInHandler = async (provider: keyof typeof authProviders) => {
    if (!authProviders[provider]) return null;

    try {
      await signIn(authProviders[provider], {
        callbackUrl: callbackUrl,
      });

      return;
    } catch (error) {
      console.log(error, 'Signin error');
    }
  };

  return (
    <div className='flex justify-center items-center flex-col mt-20'>
      <SignInForm callbackUrl={callbackUrl} />

      <div>
        <h2 className='font-semibold text-xl my-4'>Or Sign Up with:</h2>
      </div>

      <div>
        <div className='mb-2'>
          <button
            onClick={signInHandler.bind(null, 'github')}
            className='border bg-black text-gray-100 py-2 px-10 rounded-full'
          >
            GitHub
          </button>
        </div>

        <div>
          <button
            onClick={signInHandler.bind(null, 'google')}
            className='border bg-blue-700 text-gray-100 py-2 px-10 rounded-full'
          >
            Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
