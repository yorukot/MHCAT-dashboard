import redis from "../connect/connectRedis";
import { GetGuild } from "../fetchapi/GetGuild";
import { DISCORD_API_URL } from "../Data";
import { userdata } from "../schemas";
import axios from "axios";
import connectMongo from "../connect/connectMongodb";
import mongoose from "mongoose";

async function GetRedisGuild(sessionId, GuildId) {
  const GuildData =
    JSON.parse(
      await redis.get(`API/GuildData/${GuildId}`, (err, rawdata) => {
        // 可以做錯誤處理
        if (err) {
          console.log(err);
        }
        return rawdata;
      })
    ) ||
    (await getGuild(sessionId, GuildId).then((GuildData) => {
      if (["403", "500"].includes(GuildData?.status)) return;
      redis.set(
        `AI/GuildData/${GuildId}`,
        JSON.stringify(GuildData),
        "EX",
        60 * 4,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      return GuildData;
    }));
  return GuildData;
}

async function getGuild(userid, GuildId) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果沒有accessToken則返回403error
    if (!accessToken) return res.json({ status: "403" });
    //找尋資料
    const GuildData = await getGuildService(GuildId);
    //返回資料
    return { status: "200", GuildData: GuildData };
    //如果已經有資料了
  } catch (error) {
    //返回404錯誤
    return { status: "404" };
  }
}

async function getGuildService(id) {
  //取得機器人Token
  const TOKEN = process.env.TOKEN;
  //取得伺服器Channels
  const ChannelGet = await axios.get(
    `${DISCORD_API_URL}/guilds/${id}/channels`,
    {
      headers: { Authorization: `Bot ${TOKEN}` },
    }
  );
  //取得伺服器資訊
  const GuildGet = await axios.get(`${DISCORD_API_URL}/guilds/${id}`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  //設定從Api取得的Data名稱
  const Guild = GuildGet.data;
  const Channel = ChannelGet.data;
  //設定Array
  const channels = [];
  // 遍歷頻道數據並創建頻道對象
  Channel.sort(function (a, b) {
    return a.position - b.position;
  });
  Channel.forEach((channelData) => {
    // 如果parent_id為null，則它是一個最上層類別(包括頻道)
    if (channelData.parent_id === null) {
      channels.push({
        id: channelData.id,
        name: channelData.name,
        type: channelData.type,
        channels: [],
      });
    } else {
      return;
    }
  });
  Channel.forEach((channelData) => {
    // 如果parent_id為null，則它是一個最上層類別(包括頻道)
    if (channelData.parent_id !== null) {
      //如果是一個可輸入頻道，且找的到類別
      const parent = channels.find((data) => data.id === channelData.parent_id);
      //放入類別裡
      if (parent) {
        parent.channels.push({
          id: channelData.id,
          name: channelData.name,
          type: channelData.type,
        });
      }
    } else {
      return;
    }
  });
  //將身分組遞增排列
  const roles = Guild.roles.sort(function (a, b) {
    return b.position - a.position;
  });
  //反為伺服器資訊
  return {
    id: Guild.id,
    name: Guild.name,
    icon: Guild.icon,
    roles: roles,
    channels: channels,
    updatetime: Date.now(),
  };
}

export default GetRedisGuild;
