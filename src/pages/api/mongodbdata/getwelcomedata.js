import { DISCORD_API_URL } from "../../../util/Data";
import { JoinMessage, userdata } from "../../../util/schemas";
import axios from "axios";
import connectMongo from "../../../util/connectMongodb";
import mongoose from "mongoose";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

function getUserAdminGuilds(data) {
  return data.filter(({ permissions }) => (Number(permissions) & 0x8) === 0x8);
}

export default async function getUserGuilds(req, res) {
  try {
    //如果沒連結到mongodb就連結
    if (mongoose.connection.readyState === 0) await connectMongo();
    //取得使用者id
    const { userid, UserAccessToken, GuildId } = req.body;
    //從mongodb取得accessToken
    const { accessToken } = await userdata.findOne({ id: userid });
    //如果找不到
    if (!accessToken || accessToken !== UserAccessToken) return res.json({ status: "403" });
    //請求成員伺服器
    const GuildData = await JoinMessage.findOne({ guild: GuildId });
    //返回資料
    return res.json(GuildData || {status: '404'});
  } catch (error) {
    console.log(error);
    res.json({ status: "500" });
  }
}
