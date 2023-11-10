import NextAuth, { AuthOptions, Theme } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import bcrypt from 'bcrypt';
import { createTransport } from 'nodemailer';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import { FlattenMaps, Types } from 'mongoose';

import User, { UserDoc } from '@/app/(models)/User';
import clientPromise from '@/app/lib/mongodbClient';

type FoundUser =
  | (FlattenMaps<UserDoc> & {
      _id: Types.ObjectId;
    })
  | null;

type Credentials =
  | Record<'type' | 'name' | 'email' | 'password', string>
  | undefined;

export const CredentialType = {
  signIn: 'SIGNIN',
  signUp: 'SIGNUP',
};

export const options: AuthOptions = {
  // @ts-ignore
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),

  pages: {
    signIn: '/signin',
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_Secret!,
      profile(profile) {
        // console.log('Profile GitHub: ', profile);

        let userRole = 'GitHub User';
        if (profile?.email == 'rvin.ramezani@gmail.com') {
          userRole = 'admin';
        }

        return {
          ...profile,
          role: userRole,
        };
      },
    }),

    GoogleProvider({
      profile(profile) {
        // console.log('Profile Google: ', profile);

        let userRole = 'Google User';
        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email:',
          type: 'text',
          placeholder: 'your-email',
        },
        password: {
          label: 'password:',
          type: 'password',
          placeholder: 'your-password',
        },
        type: {},
        name: {},
      },

      async authorize(credentials: Credentials) {
        try {
          const foundUser = await User.findOne({ email: credentials?.email })
            .lean()
            .exec();

          // console.log(credentials);

          // console.log(credentials?.type);
          if (credentials?.type === CredentialType.signIn) {
            // await handleSignin(foundUser, credentials);
            return handleSignin(foundUser, credentials);
          } else if (credentials?.type === CredentialType.signUp) {
            return handleSignup(foundUser, credentials);
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      // server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,

      async sendVerificationRequest(params) {
        try {
          const { identifier, url, provider, theme } = params;
          const { host } = new URL(url);

          // NOTE: You are not required to use `nodemailer`, use whatever you want.
          const transport = createTransport(provider.server);

          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Sign in to ${host}`,
            text: text({ url, host }),
            html: html({ url, host, theme }),
          });

          const failed = result.rejected.concat(result.pending).filter(Boolean);
          if (failed.length) {
            throw new Error(
              `Email(s) (${failed.join(', ')}) could not be sent`
            );
          }
        } catch (error) {
          console.log(error, 'sendVerificationError');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },

    async session({ session, token }) {
      if (session?.user && session?.user?.role) session.user.role = token.role;
      return session;
    },

    async signIn({ user, account, email }) {
      const userExists = await User.findOne({
        email: user.email, //the user object has an email property, which contains the email the user entered.
      });

      return true;

      // if (userExists) {
      //   return true; //if the email exists in the User collection, email them a magic login link
      // } else {
      //   return '/register';
      // }
    },
  },
};

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = theme.brandColor || '#346df1';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`;
}

async function handleSignin(foundUser: any, credentials: Credentials) {
  if (!foundUser) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(
    credentials!.password,
    foundUser.password
  );

  if (!isPasswordValid) throw new Error('Invalid credentials');

  const { password, ...userWithoutPassword } = foundUser;
  return { ...userWithoutPassword, role: 'Unverified Email' };
}

async function handleSignup(foundUser: FoundUser, credentials: Credentials) {
  if (foundUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(credentials!.password, 10);

  const createdUser = await User.create({
    email: credentials!.email,
    password: hashedPassword,
    name: credentials?.name,
  });

  if (!createdUser.email)
    throw new Error('Something went wrong, please try again');

  const userWithoutPassword = {
    name: createdUser?.name,
    email: createdUser?.email,
  };

  return { ...userWithoutPassword, role: 'Unverified Email' };
}
