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
    async signIn({ user, account, profile }) {
      // Debug logs
      console.log('Sign-in attempt:', {
        email: user.email,
        allowedEmail: process.env.NEXT_PUBLIC_ALLOWED_EMAIL,
        match: user.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL
      });
      
      // Only allow specific email
      return user.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL;
    },
    async session({ session, token }) {
      // Add user's GitHub profile data to session
      return {
        ...session,
        user: {
          ...session.user,
          isAdmin: session.user?.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL
        }
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}) 