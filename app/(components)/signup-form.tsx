'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';

export interface SignUpFormProps {
  callbackUrl: string;
}

function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<
    Record<'name' | 'email' | 'password' | 'confirmPassword', string>
  >({ email: '', password: '', name: '', confirmPassword: '' });

  const [errorMessage, setErrorMessage] = useState('');
  const signinLink = `/signin${callbackUrl && `?callbackUrl=${callbackUrl}`}`;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (
      !formData.email?.trim() ||
      !formData.password?.trim() ||
      !formData.confirmPassword?.trim()
    ) {
      setErrorMessage('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const res = await signIn('credentials', {
        redirect: false,
        callbackUrl: '/',
        type: CredentialType.signUp,
        email: formData.email,
        password: formData.password,
        name: formData?.name || '',
      });

      if (!res?.ok && res?.error) return setErrorMessage(res.error);

      router.refresh();
      return router.replace(callbackUrl);
    } catch (error) {
      setErrorMessage(error as string);
      console.log(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='border p-10 rounded-2xl bg-gray-600 text-gray-100'
    >
      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='email'>Email:</label>
        <input
          name='email'
          id='email'
          type='email'
          className='py-2 px-3 rounded-lg text-black'
          required
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='name'>Your Name:</label>
        <input
          name='name'
          id='name'
          type='text'
          className='py-2 px-3 rounded-lg'
          onChange={handleChange}
        />
      </div>

      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='password'>Password:</label>
        <input
          name='password'
          id='password'
          type='password'
          autoComplete='false'
          required
          onChange={handleChange}
          className='py-2 px-3 rounded-lg text-black'
        />
      </div>

      <div className='flex flex-col mb-3 gap-1'>
        <label htmlFor='confirmPassword'>Confirm Password:</label>
        <input
          name='confirmPassword'
          id='confirmPassword'
          type='password'
          autoComplete='false'
          required
          onChange={handleChange}
          className='py-2 px-3 rounded-lg text-black'
        />
      </div>

      <div className='flex flex-col mb-3 gap-1'>
        <input
          type='submit'
          value='Sign Up'
          name='signupButton'
          id='signupButton'
          className='py-2 px-3 rounded-lg font-bold cursor-pointer bg-black text-white mt-3'
        />
      </div>

      <Link href={signinLink}>Sign In</Link>

      <p className='text-red-500 mt-4'>{errorMessage}</p>
    </form>
  );
}

export default SignUpForm;
