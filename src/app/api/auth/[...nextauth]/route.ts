import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  debug: true,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        // Debug logs
        console.log('Sign-in attempt:', {
          email: user.email,
          allowedEmail: process.env.NEXT_PUBLIC_ALLOWED_EMAIL,
        });
        
        if (!user.email || !process.env.NEXT_PUBLIC_ALLOWED_EMAIL) {
          console.log('Missing email or allowed email configuration');
          return false;
        }
        
        return user.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL;
      } catch (error) {
        console.error('Sign-in error:', error);
        return false;
      }
    },
    async session({ session }) {
      try {
        return {
          ...session,
          user: {
            ...session.user,
            isAdmin: session.user?.email === process.env.NEXT_PUBLIC_ALLOWED_EMAIL
          }
        }
      } catch (error) {
        console.error('Session error:', error);
        return session;
      }
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}) 