import axios from "axios";
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function GetUserGuilds(UserAccessToken, userId) {
  const requestBody = {
    'accessToken': UserAccessToken,
    'userid': userId
  };
  
  const response = await fetch("/api/discord/getusreguilds", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
