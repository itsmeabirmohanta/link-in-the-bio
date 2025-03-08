import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      // Debug logs
      console.log('Attempting sign in for user:', user.email);
      console.log('Allowed email:', process.env.ALLOWED_EMAIL);
      console.log('Email match:', user.email === process.env.ALLOWED_EMAIL);
      
      return user.email === process.env.ALLOWED_EMAIL
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}) 