import redis from "./connectRedis";
import { GetUserGuilds } from "../fetchapi/GetUserGuilds";
import { DISCORD_API_URL } from "../Data";
import { guilds, userdata } from "../schemas";
import axios from "axios";
import connectMongo from "../connectMongodb";
import mongoose from "mongoose";

async function GetRedisUserGuilds(sessionId) {
  const GuildData =
  JSON.parse(await redis.get(`API/GuildsData/${sessionId}`, (err, rawdata) => {
      // 可以做錯誤處理
      if (err) {
        console.log(err);
      }
      return rawdata;
    })) ||
    (await getUserGuilds(sessionId).then((GuildsData) => {
      if (["403", "500"].includes(GuildsData?.status)) return;
      redis.set(
        `API/GuildsData/${sessionId}`,
        JSON.stringify(GuildsData),
        "EX",
        60 * 1,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      return GuildsData
    }));
  return (GuildData);
}
function getUserAdminGuilds(data) {
  return data.filter(({ permissions }) => (Number(permissions) & 0x8) === 0x8);
}

async function getUserGuilds(userid) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果找不到
    if (!accessToken) return { status: "403" }
    //請求成員伺服器
    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    //將伺服器節省為只有具有管理員的伺服器才放上去
    const adminGuilds = getUserAdminGuilds(guildsData.data);
    //返回資料
    return adminGuilds
  } catch (error) {
    console.log(error);
    return { status: "500" }
  }
}

export default GetRedisUserGuilds;
