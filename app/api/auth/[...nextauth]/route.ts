import bcrypt from 'bcrypt'
import NextAuth, {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'   //We are renaming the default export from credentials to CP as we import it
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from '@/app/libs/prismadb'
import prisma2 from "@/app/libs/prismadb"

export const authOptions: AuthOptions={
    adapter: PrismaAdapter(prisma),
    providers:[
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "credentials",
            credentials:{
                email: {label:'email', type: 'text'},
                password: {label: 'password', type: 'password'}
            },
            // Authorize function compares what the user has written with what is in the database
            async authorize(credentials){
                //If there is no input on the email or password
                if(!credentials?.email || !credentials?.password){
                    throw new Error('Invalid Credentials')
                }

                const user = await prisma.user.findUnique({
                    where: {email: credentials.email}
                })

                // If there is no registered user with that email or 
                // the user is registered using github or google.
                if(!user || !user?.hashedPassword){
                    throw new Error('Invalid Credentials')
                }

                //Checking for the password
                const isCorrectPassword= await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if( !isCorrectPassword){
                    throw new Error('Invalid Credentials')
                }

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development', // There will be a many use full authentication logs in development mode about the authentication
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler= NextAuth(authOptions)

export {handler as GET, handler as POST}