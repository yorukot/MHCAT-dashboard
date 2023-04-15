import axios from "axios";
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function SaveWelcomeData(userId, UserAccessToken, GuildId, SaveData) {
  const requestBody = {
    'userid': userId,
    'UserAccessToken': UserAccessToken,
    'SaveData': SaveData,
    'GuildId': GuildId,
  };
  const response = await fetch("http://localhost:3000/api/savedata/saveWelcomeData", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
