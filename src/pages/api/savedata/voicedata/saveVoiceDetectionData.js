import { DISCORD_API_URL } from "../../../../util/Data";
import { guild, userdata } from "../../../../util/schemas";
import axios from "axios";
import connectMongo from "../../../../util/connect/connectMongodb";
import mongoose from "mongoose";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function API_SaveWelcomeData(req, res) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //取得使用者id
    const { userid, UserAccessToken, GuildId, SaveData } = req.body;
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果找不到
    if (!accessToken || accessToken !== UserAccessToken)
    return res.status(403).json({ message: 'You do not have permission to access this data' });
    //請求成員伺服器
    const VoiceDetectionData = await guild.findOneAndUpdate(
      { guild: GuildId },
      { voice_detection: !SaveData.enable ? null : SaveData.channel},
      { new: true }
    ) || await guild.create({
        guild: GuildId,
        voice_detection: !SaveData.enable ? null : SaveData.channel
    });
    //返回資料
    if(!VoiceDetectionData) return res.status(500).json({ message: 'An unknown error occurred while processing the data'})
    return res.status(200).json(VoiceDetectionData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
