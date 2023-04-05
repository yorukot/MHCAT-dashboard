import { DISCORD_API_URL } from "../../../util/Data";
import { guilds } from "../../../util/schemas";
import axios from "axios";
import connectMongo from '../../../util/connectMongodb'
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
    if(mongoose.connection.readyState === 0) await connectMongo()
  const DateNow = Date.now();
  const { accessToken, userid } = req.body
  const userGuilds = await guilds.findOne({ id: userid });
  if (!userGuilds) {
    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const adminGuilds = getUserAdminGuilds(guildsData.data);
    const newUserGuilds = new guilds({ id: userid, guilds: adminGuilds, updatetime: DateNow });
    await newUserGuilds.save();
    return res.json(adminGuilds)
  } else if (DateNow - userGuilds.updatetime > 300000) {
    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const adminGuilds = getUserAdminGuilds(guildsData.data);
    await guilds.findOneAndUpdate(
      { id: userid },
      { guilds: adminGuilds, updatetime: DateNow},
      { new: true }
    );
    return res.json(adminGuilds)
  } else {
    return res.json(userGuilds.guilds)
  }
}
