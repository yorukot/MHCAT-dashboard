import { DISCORD_API_URL } from "../../../util/Data";
import { guilds, userdata } from "../../../util/schemas";
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
  //如果沒連結到mongodb就連結
  if (mongoose.connection.readyState === 0) await connectMongo();
//設定現在間
  const DateNow = Date.now();
  //取得使用者id
  const { userid, GiveAccessToken } = req.body;
  //從mongodb取得accessToken
  const { accessToken } = await userdata.findOne({ id: userid });
  if(accessToken !== GiveAccessToken) return res.json({status: '403'})
  //取得使用者具管理權的伺服器
  const userGuilds = await guilds.findOne({ id: userid });
  //如果找不到
  if (!userGuilds) {
    //請求成員伺服器
    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    //將伺服器節省為只有具有管理員的伺服器才放上去
    const adminGuilds = getUserAdminGuilds(guildsData.data);

    //創建伺服器資料
    const newUserGuilds = new guilds({
      id: userid,
      guilds: adminGuilds,
      updatetime: DateNow,
    });
    await newUserGuilds.save();
    //返回資料
    return res.json(adminGuilds);
  //如果上次擷取時間過長
  } else if (DateNow - userGuilds.updatetime > 1800000) {
        //請求成員伺服器
    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    //更新資料
    const adminGuilds = getUserAdminGuilds(guildsData.data);
    await guilds.findOneAndUpdate(
      { id: userid },
      { guilds: adminGuilds, updatetime: DateNow },
      { new: true }
    );
    //返回資料
    return res.json(adminGuilds);
    //如果有找到資料
  } else {
    //直接返回資料
    return res.json(userGuilds.guilds);
  }
}
