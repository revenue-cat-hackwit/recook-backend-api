// @/lib/authOptions.ts

import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from './mongoConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('Invalid email or password')
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email before logging in')
        }

        if (!user.password) {
          throw new Error('This account uses Google login. Please sign in with Google.')
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.username,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB()

        try {
          // Check if user already exists
          let existingUser = await User.findOne({ email: user.email })

          if (existingUser) {
            // Update Google ID if not set
            if (!existingUser.googleId && account.providerAccountId) {
              existingUser.googleId = account.providerAccountId
              existingUser.provider = 'google'
              existingUser.image = user.image
              existingUser.isVerified = true
              await existingUser.save()
            }
          } else {
            // Create new user
            existingUser = await User.create({
              username: user.name || user.email?.split('@')[0],
              email: user.email,
              googleId: account.providerAccountId,
              provider: 'google',
              image: user.image,
              isVerified: true,
            })
          }

          // Attach user ID to the user object
          user.id = existingUser._id.toString()
        } catch (error) {
          console.error('Error during Google sign in:', error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}
