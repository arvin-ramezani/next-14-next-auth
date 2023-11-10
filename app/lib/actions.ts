'use server';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

export const signinEmail = async (formData: FormData) => {
  const userData = Object.fromEntries(formData);

  const token = jwt.sign(
    { email: userData.email },
    process.env.EMAIL_JWT_SECRET!,
    {
      expiresIn: '1h',
    }
  );
  try {
    const res = await fetch(
      'http://localhost:3000/api/auth/verify?token=' + token
    );

    //   Sent email with login link and token to the user.
    const sendEmailRes = await sendEmail(userData.email as string);

    //   Signin link: { html: `<a href="http://localhost:3000/api/auth/verify?token=${token}'>Verify</a>` }

    return;
  } catch (error) {
    console.log(error, 'action error');
  }

  // revalidatePath("/dashboard/users");
  // redirect("/dashboard/users");
};

async function sendEmail(email: string) {
  const {
    EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD,
    EMAIL_FROM,
  } = process.env;

  const transporter = createTransport({
    // @ts-ignore
    host: EMAIL_SERVER_HOST,
    port: EMAIL_SERVER_PORT,
    tls: true,
    auth: {
      user: EMAIL_SERVER_USER,
      pass: EMAIL_SERVER_PASSWORD,
    },
  });

  return transporter.sendMail({
    // from: 'MyName <from@example.com>',
    from: EMAIL_FROM,
    to: email,
    subject: 'Test Email Subject',
    html: '<h1>Example HTML Message Body</h1>',
  });
}
