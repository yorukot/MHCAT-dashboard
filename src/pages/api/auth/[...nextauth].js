import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

const scopes = ['identify', 'guilds'].join(' ')

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {params: {scope: scopes}},
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      session.discriminator = token.discriminator;
      session.id = token.id;
      return session
    },
    async jwt({ token, user, account, profile}) {
      if (profile) {
        token.discriminator = profile.discriminator;
        token.id = profile.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token
    }
  },
  secret: process.env.JWT_SECRET
})