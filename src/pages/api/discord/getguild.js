import { DISCORD_API_URL } from "../../../util/Data";
import { guilds,userdata } from "../../../util/schemas";
import axios from "axios";
import connectMongo from '../../../util/connectMongodb'
import mongoose from "mongoose";

/**
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */

export default async function getGuild(req, res) {
  
}

export function getGuildService(id) {
  const TOKEN = process.env.TOKEN;
  return axios.get(`${DISCORD_API_URL}/guilds/${id}`, {
    headers: { Authorization: `Bot ${TOKEN}` },
  })
}
