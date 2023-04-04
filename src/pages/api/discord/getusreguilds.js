import { DISCORD_API_URL } from "../../../util/Data";
import { guilds } from "../../../util/schemas";
import axios from "axios";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

function getUserAdminGuilds(data) {
  return data.filter(({ permissions }) => (Number(permissions) & 0x8) === 0x8);
}
export default async function getUserGuilds(req, res) {
  const DateNow = Date.now();
  console.log(req.body)
  const { accessToken, userid } = JSON.stringify(req.body);
  console.log(req.body.accessToken);
  console.log(accessToken);
  console.log(userid); 
  const userGuilds = await guilds.findOne({ id: userid });
  if (!userGuilds) {

    console.log('nogetUserGuilds')

    const guildsData = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log(guildsData);
    const adminGuilds = getUserAdminGuilds(guildsData.data);
    const newUserGuilds = new guilds({ id: userid, guilds: adminGuilds, updatetime: DateNow });
    await newUserGuilds.save();
    return res.json(adminGuilds)
  } else if (DateNow - userGuilds.updatetime > 300000) {
    console.log('getDatatimebigtjan3000000')
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
    console.log('getData')
    return res.json(userGuilds.guilds)
  }
}
