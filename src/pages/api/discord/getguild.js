import { DISCORD_API_URL } from "../../../util/Data";
import { userdata } from "../../../util/schemas";
import axios from "axios";
import connectMongo from "../../../util/connect/connectMongodb";
import mongoose from "mongoose";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function getGuild(req, res) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //取得Api取得的userid跟伺服器Id
    const { userid, GuildId } = req.body;
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果沒有accessToken則返回403error
    if (!accessToken) return res.json({ status: "403" });
    //找尋資料
    const GuildData = await getGuildService(GuildId);
    //返回資料
    return res.json({ status: "200", GuildData: GuildData });
  } catch (error) {
    //如果機器人不在伺服器中，返回404錯誤
    if (error.message === 'BOT_NOT_IN_GUILD') {
      return res.json({ status: "404" });
    }
    //console.log錯誤
    console.log('getGuild API error:', error);
    //其他錯誤返回500
    res.json({ status: "500" });
  }
}


export async function getGuildService(id) {
  //取得機器人Token
  const TOKEN = process.env.TOKEN;
  
  let GuildGet, ChannelGet;
  
  try {
    //取得伺服器資訊
    GuildGet = await axios.get(`${DISCORD_API_URL}/guilds/${id}`, {
      headers: { Authorization: `Bot ${TOKEN}` },
    });
    //取得伺服器Channels
    ChannelGet = await axios.get(`${DISCORD_API_URL}/guilds/${id}/channels`, {
      headers: { Authorization: `Bot ${TOKEN}` },
    });
  } catch (error) {
    // If the bot is not in the server, Discord API will return 403 or 404
    if (error.response?.status === 403 || error.response?.status === 404) {
      throw new Error('BOT_NOT_IN_GUILD');
    }
    // Re-throw other errors
    throw error;
  }
  
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
