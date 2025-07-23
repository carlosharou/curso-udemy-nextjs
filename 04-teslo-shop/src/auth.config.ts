import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import prisma from './lib/prisma';
import bcryptjs from 'bcryptjs';

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account'
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.data = user;
            }

            return token;
        },
        session({ session, token }) {
            session.user = token.data as any;
            return session;
        },
        /*authorized({ auth, request: { nextUrl } }) { // middleware
            const isLoggedIn = !!auth?.user;
            const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
            if (isOnCheckout) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },*/
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ 
                        email: z.string().email(), 
                        password: z.string().min(6)
                    }).safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                // buscar el usuario por correo
                const user = await prisma.user.findUnique({ where: { email: email.toLocaleLowerCase() }});

                if (!user) {
                    return null;
                }

                // compara las contraseñas
                if (!bcryptjs.compareSync(password, user.password) ) {
                    return null;
                }

                // regresa el usuario sin el password
                const { password: _pass, ...restUser } = user;
                
                return restUser;
            }
        })
    ]
};

export const { signIn, signOut, auth, handlers } = NextAuth( authConfig );