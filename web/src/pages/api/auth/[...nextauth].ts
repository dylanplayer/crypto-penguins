import NextAuth, { type AuthOptions } from "next-auth";
import { MoralisNextAuthProvider } from "@moralisweb3/next";

export const authOptions: AuthOptions = {
  providers: [MoralisNextAuthProvider()],
  // adding user info to the user session object
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      (session as { user: unknown }).user = token.user;
      return session;
    },
  },
};

export default NextAuth(authOptions);
