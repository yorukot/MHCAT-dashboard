//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function GetWelcomeData(userId, guildId, accessToken) {
    const requestBody = {
      'userid': userId,
      'GuildId': guildId,
      'UserAccessToken': accessToken,
    };
    const response = await fetch("http://localhost:3000/api/mongodbdata/getwelcomedata", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }
  