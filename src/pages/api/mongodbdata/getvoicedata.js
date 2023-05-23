import { DISCORD_API_URL } from "../../../util/Data";
import { guild, userdata } from "../../../util/schemas";
import axios from "axios";
import connectMongo from "../../../util/connect/connectMongodb";
import mongoose from "mongoose";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */


export default async function getWarnData(req, res) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //取得使用者id
    const { userid, UserAccessToken, GuildId } = req.body;
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果找不到
    if (!accessToken || accessToken !== UserAccessToken) return res.status(403).json({ message: 'You do not have permission to access this data' });

    //請求成員伺服器
    const GuildData = await guild.findOne({ guild: GuildId });
    //返回資料
    if(!GuildData) return res.status(404).json({ message: 'Could not find the data'})
    return res.status(200).json(GuildData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
