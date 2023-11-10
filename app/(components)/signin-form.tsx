'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';

export const CredentialType = {
  signIn: 'SIGNIN',
  signUp: 'SIGNUP',
};

export interface SignInFormProps {
  callbackUrl: string;
}
function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<
    Record<'name' | 'email' | 'password', string>
  >({ email: '', password: '', name: '' });

  const [errorMessage, setErrorMessage] = useState('');

  const signupLink = `/signup${callbackUrl && `?callbackUrl=${callbackUrl}`}`;

  console.log(callbackUrl);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!formData?.email?.trim() || !formData?.password?.trim()) {
      setErrorMessage('All fields are required');
      return;
    }

    try {
      const res = await signIn('credentials', {
        redirect: false,
        // callbackUrl: callbackUrl,
        type: CredentialType.signIn,
        email: formData.email,
        password: formData.password,
      });

      console.log(res);
      if (!res?.ok) {
        setErrorMessage(res?.error || '');
        return;
      } else {
        router.refresh();
        console.log(callbackUrl, 'callback');
        router.replace(callbackUrl);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className='border p-10 rounded-2xl bg-gray-600 text-gray-100'
    >
      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='email'>Email:</label>
        <input
          name='email'
          id='email'
          type='email'
          onChange={handleChange}
          className='py-2 px-3 rounded-lg text-black'
        />
      </div>

      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='password'>Password:</label>
        <input
          name='password'
          id='password'
          type='password'
          autoComplete='false'
          onChange={handleChange}
          className='py-2 px-3 rounded-lg text-black'
        />
      </div>

      <Link
        className='mt-7 block font-normal text-blue-300'
        href={'/signin/email'}
      >
        Signin with Email-Only
      </Link>

      <div className='flex flex-col mb-3 gap-1'>
        <input
          type='submit'
          value='Sign In'
          name='signupButton'
          id='signupButton'
          className='py-2 px-3 rounded-lg font-bold cursor-pointer bg-black text-white mt-3 focus:outline-white'
        />
      </div>

      <p className='text-red-500 mt-4'>{errorMessage}</p>

      <Link href={signupLink}>Sign Up</Link>
    </form>
  );
}

export default SignInForm;
