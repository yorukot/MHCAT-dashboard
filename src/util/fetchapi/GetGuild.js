import {MHCATAPIURL} from '../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function GetGuild(userId, guildId) {
  const requestBody = {
    'userid': userId,
    'GuildId': guildId
  };
  const response = await fetch(MHCATAPIURL + "/api/discord/getguild", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
