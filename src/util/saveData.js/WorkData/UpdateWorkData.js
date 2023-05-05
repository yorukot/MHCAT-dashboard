import axios from "axios";
import {MHCATAPIURL} from '../../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function UpdateWorkData(userId, UserAccessToken, GuildId, UpdateData, OldDataName) {
  const requestBody = {
    'userid': userId,
    'UserAccessToken': UserAccessToken,
    'UpdateData': UpdateData,
    'GuildId': GuildId,
    'OldDataName': OldDataName
  };
  const response = await fetch(MHCATAPIURL + "/api/savedata/workdata/updateworkData", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
