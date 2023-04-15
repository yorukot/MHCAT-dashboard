import redis from "./connectRedis";
import { GetUserGuilds } from "../fetchapi/GetUserGuilds";

async function GetRedisUserGuilds(sessionId) {
  const GuildData =
    (await redis.get(`API/GuildsData/${sessionId}`, (err, rawdata) => {
      // 可以做錯誤處理
      if (err) {
        console.log(err);
      }
      return rawdata;
    })) ||
    (await GetUserGuilds(sessionId).then((GuildsData) => {
      if (["403", "500"].includes(GuildsData?.status)) return;
      redis.set(
        `API/GuildsData/${sessionId}`,
        JSON.stringify(GuildsData),
        "EX",
        60 * 2 * 1000,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }));
  return JSON.parse(GuildData);
}

export default GetRedisUserGuilds;
