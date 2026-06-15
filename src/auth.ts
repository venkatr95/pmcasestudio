import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import EmailProvider from 'next-auth/providers/nodemailer';
import CredentialsProvider from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { authConfig } from './auth.config';
import { createTransport } from 'nodemailer';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });
        
        // Auto-provision default admin
        if (!user && credentials.email === 'admin@pmcasestudio.com' && credentials.password === 'admin123') {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          user = await prisma.user.create({
            data: {
              name: 'Administrator',
              email: 'admin@pmcasestudio.com',
              hashedPassword,
              role: 'ADMIN',
              emailVerified: new Date()
            }
          });
        }
        
        if (!user || !user.hashedPassword) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        
        if (!isPasswordValid) return null;
        
        return user;
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // 10 minutes
      generateVerificationToken() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      async sendVerificationRequest(params) {
        const { identifier, url, provider, token } = params;
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Your PM Case Studio Login Code is ${token}`,
          text: `Here is your one-time code to sign in: ${token}\n\nIt expires in 10 minutes.`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #333;">Sign in to PM Case Studio</h2>
              <p style="color: #555; font-size: 16px;">Here is your one-time authentication code:</p>
              <div style="background-color: #f4f4f5; padding: 20px; text-align: center; border-radius: 8px; margin: 24px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111;">${token}</span>
              </div>
              <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
              <p style="color: #999; font-size: 12px; margin-top: 32px;">If you didn't request this email, you can safely ignore it.</p>
            </div>
          `,
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? 'USER';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.userPreferences.create({
        data: { userId: user.id! },
      });
    },
  },
});
