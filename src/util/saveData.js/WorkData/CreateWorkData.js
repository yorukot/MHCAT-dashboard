import axios from "axios";
import {MHCATAPIURL} from '../../Data'
//import { guilds } from "./schemas";
//import mongoose from "mongoose";
//import connect from './connectMongodb'

export async function CreateWorkData(userId, UserAccessToken, CreateData) {
  const requestBody = {
    'userid': userId,
    'UserAccessToken': UserAccessToken,
    'CreateData': CreateData,
  };
  const response = await fetch(MHCATAPIURL + "/api/savedata/workdata/createworkData", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
}
