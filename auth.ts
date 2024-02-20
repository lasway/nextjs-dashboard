import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
// import type { User } from '@/app/lib/definitions';
import bcryptjs from 'bcryptjs';

async function getUser(email: string) {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        // console.log(user);
        return user;
    } finally {
        await prisma.$disconnect();
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordsMatch = await bcryptjs.compare(password, user.password)

                    if (passwordsMatch) return user

                }

                console.log('Invalid credentials')

                return null;
            },
        }),
    ],
});