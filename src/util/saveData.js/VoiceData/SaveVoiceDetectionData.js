import axios from "axios";
import {MHCATAPIURL} from '../../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function SaveVoiceDetectionData(userId, UserAccessToken, GuildId, SaveData) {
  const requestBody = {
    'userid': userId,
    'UserAccessToken': UserAccessToken,
    'SaveData': SaveData,
    'GuildId': GuildId,
  };
  const response = await fetch(MHCATAPIURL + "/api/savedata/voicedata/saveVoiceDetectionData", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
