import redis from "./connectRedis";
import { GetGuild } from "../fetchapi/GetGuild";

async function GetRedisGuild(sessionId, GuildId) {
  const GuildData =
    (await redis.get(`API/GuildData/${GuildId}`, (err, rawdata) => {
      // 可以做錯誤處理
      if (err) {
        console.log(err);
      }
      return rawdata;
    })) ||
    (await GetGuild(sessionId, GuildId).then((GuildData) => {
      if (["403", "500"].includes(GuildData?.status)) return;
      redis.set(
        `API/GuildData/${GuildId}`,
        JSON.stringify(GuildData),
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

export default GetRedisGuild;
