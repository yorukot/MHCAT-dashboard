import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { userdata } from "../../../util/schemas/index";
import connectMongo from '../../../util/connectMongodb'
import mongoose from "mongoose";

//添加意圖
const scopes = ["identify", "guilds"].join(" ");

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: scopes } },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, user, token }) {
      //讓session.id等於jwt回傳的使用者tag
      session.discriminator = token.discriminator;
      //讓session.id等於jwt回傳的使用者id
      session.id = token.id;
      session.accessToken = token.accessToken;
      //回傳session
      return session;
    },
    async jwt({ token, user, account, profile }) {
      //如果mongodb沒連結就連接
      if(mongoose.connection.readyState === 0) await connectMongo()
      //如果有這兩個資料
      if(token && profile){
        //嘗試找到並更新資料
        const accessTokenUpdate = await userdata.findOneAndUpdate(
          { id: profile.id },
          { accessToken: account.access_token },
          { new: true }
        );
        //如果更新失敗就創建新資料
        if (!accessTokenUpdate) {
          userdata.create({ id: profile.id, accessToken: account.access_token });
        }
      }
      //如果有這個資料
      if (profile) {
        //讓返回的資料有使用者的tag，好方便session取得資料
        token.discriminator = profile.discriminator;
        token.id = profile.id;
        token.accessToken = account.access_token;
      }
      //返回token(帶有profile id)
      return token;
    },
  },
  secret: process.env.JWT_SECRET,
});
