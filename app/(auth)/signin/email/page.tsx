'use client';
import { signIn } from 'next-auth/react';

import { signinEmail } from '@/app/lib/actions';
import { FormEventHandler, useRef } from 'react';

export default function EmailPage() {
  const ref = useRef<HTMLInputElement>(null);

  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await signIn('email', {
      email: ref.current?.value,
      redirect: false,
    });
  };

  return (
    <div className='px-3 md:px-12'>
      <h1 className='my-12'>Email</h1>
      <form
        onSubmit={submitHandler}
        className='border p-3 md:p-10 rounded-2xl bg-gray-600 text-gray-100 mx-auto'
      >
        <div className='flex flex-col mb-3 gap-1'>
          <label htmlFor='email'>Email:</label>
          <input
            ref={ref}
            name='email'
            id='email'
            type='email'
            //   onChange={handleChange}
            className='py-2 px-3 rounded-lg text-black'
          />
        </div>

        <div>
          <label htmlFor='submitForm'></label>
          <input
            className='w-full bg-blue-800 rounded-2xl py-3 font-bold text-2xl mt-4'
            name='submitForm'
            type='submit'
            value='Send'
          />
        </div>
      </form>
    </div>
  );
}

// export default function EmailPage() {
//   return (
//     <div className='px-3 md:px-12'>
//       <h1 className='my-12'>Email</h1>
//       <form
//         action={signinEmail}
//         //   onSubmit={submitHandler}
//         className='border p-3 md:p-10 rounded-2xl bg-gray-600 text-gray-100 mx-auto'
//       >
//         <div className='flex flex-col mb-3 gap-1'>
//           <label htmlFor='email'>Email:</label>
//           <input
//             name='email'
//             id='email'
//             type='email'
//             //   onChange={handleChange}
//             className='py-2 px-3 rounded-lg text-black'
//           />
//         </div>

//         <div>
//           <input
//             className='w-full bg-blue-800 rounded-2xl py-3 font-bold text-2xl mt-4'
//             type='submit'
//             value='Send'
//           />
//         </div>
//       </form>
//     </div>
//   );
// }
