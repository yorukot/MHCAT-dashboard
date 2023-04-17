import axios from "axios";
import {MHCATAPIURL} from '../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function GetUserGuilds(userId) {
  const requestBody = {
    'userid': userId
  };
  const response = await fetch(MHCATAPIURL + "/api/discord/getusreguilds", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
