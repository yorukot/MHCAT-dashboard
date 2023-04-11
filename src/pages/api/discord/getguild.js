import { DISCORD_API_URL } from "../../../util/Data";
import { userdata, guildData } from "../../../util/schemas";
import axios from "axios";
import connectMongo from "../../../util/connectMongodb";
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
    //嘗試尋找伺服器
    const Guild = await guildData.findOne({ id: GuildId });
    //如果沒有找到
    if (!Guild) {
      //取得伺服器資料
      const GuildData = await getGuildService(GuildId);
      //創建新資料
      const newGuildGuilds = new guildData(GuildData);
      //儲存資料
      await newGuildGuilds.save();
      //返回資料
      return res.json({ status: "200", GuildData: GuildData });
      //如果上次更新時間過久
    } else if (Date.now() - Guild.updatetime > 1800000) {
      //找尋資料
      const GuildData = await getGuildService(GuildId);
      //取得資料並更新
      const newUserGuilds = await guildData.findOneAndUpdate(
        { id: GuildId },
        GuildData,
        { new: true }
      );
      //返回資料
      return res.json({ status: "200", GuildData: GuildData });
      //如果已經有資料了
    } else {
      //返回資料
      return res.json({ status: "200", GuildData: Guild });
    }
  } catch (error) {
    //console.log錯誤
    console.log(error);
    //返回404錯誤
    res.json({ status: "404" });
  }
}


export async function getGuildService(id) {
  //取得機器人Token
  const TOKEN = process.env.TOKEN;
  //取得伺服器Channels
  const ChannelGet = await axios.get(`${DISCORD_API_URL}/guilds/${id}/channels`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  //取得伺服器資訊
  const GuildGet = await axios.get(`${DISCORD_API_URL}/guilds/${id}`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  });
  //設定從Api取得的Data名稱
  const Guild = GuildGet.data
  const Channel = ChannelGet.data
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
