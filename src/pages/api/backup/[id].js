import connectMongo from '../../../util/connect/connectMongodb';
import mongoose from 'mongoose';
import { userdata } from '../../../util/schemas';
import axios from 'axios';
import { DISCORD_API_URL } from '../../../util/Data';

// 所有含有 guild 欄位的 collection 名稱
const GUILD_COLLECTIONS = [
  'ann_all_set',
  'birthday',
  'birthday_set',
  'btn',
  'chat',
  'chat_role',
  'chatgpt',
  'chatgpt_get',
  'coin',
  'create_hours',
  'cron_set',
  'errors_set',
  'ghp',
  'gift',
  'gift_change',
  'good_web',
  'guild',
  'join_message',
  'join_role',
  'leave_message',
  'lock_channel',
  'logging',
  'lotter',
  'message_reaction',
  'Number',
  'poll',
  'role_number',
  'sign_list',
  'text_xp',
  'text_xp_channel',
  'ticket',
  'verification',
  'voice_channel',
  'voice_channel_id',
  'voice_role',
  'voice_xp',
  'voice_xp_channel',
  'vote',
  'warndb',
  'work_set',
  'work_something',
  'work_user',
];

/**
 * 備份格式：每個 key 對應 collection 名稱，value 為文件陣列
 * 可直接使用 mongoimport 還原：
 *   mongoimport --uri "..." --db mhcat-database --collection <key> --jsonArray --file <key>.json
 *
 * @param { import('next').NextApiRequest} req
 * @param { import('next').NextApiResponse } res
 */
export default async function getBackupData(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    if (mongoose.connection.readyState === 0) await connectMongo();

    const { userid } = req.body;
    const { id: GuildId } = req.query;

    // 驗證使用者身份並取得 accessToken（與其他 API 一致的做法）
    const userData = await userdata.findOne({ id: userid });
    if (!userData?.accessToken) {
      return res.status(403).json({ message: 'You do not have permission to access this data' });
    }

    // 驗證使用者對該 guild 有管理員權限（ADMINISTRATOR = 0x8）
    // 直接向 Discord API 查詢，防止任何人用別人的 guild ID 備走他人資料
    let hasAdminPermission = false;
    try {
      const discordRes = await axios.get(`${DISCORD_API_URL}/users/@me/guilds`, {
        headers: { Authorization: `Bearer ${userData.accessToken}` },
      });
      hasAdminPermission = discordRes.data.some(
        (g) => g.id === GuildId && (Number(g.permissions) & 0x8) === 0x8
      );
    } catch {
      return res.status(403).json({ message: 'Failed to verify guild permissions' });
    }

    if (!hasAdminPermission) {
      return res.status(403).json({ message: 'You do not have administrator permission in this guild' });
    }

    // debug: 列出所有 database 和其中的 collections
    const adminDb = mongoose.connection.db.admin();
    const { databases } = await adminDb.listDatabases();
    for (const dbInfo of databases) {
      const db = mongoose.connection.useDb(dbInfo.name, { useCache: true }).db;
      const collections = await db.listCollections().toArray();
      console.log(`[backup] DB: ${dbInfo.name} =>`, collections.map(c => c.name).join(', '));
    }

    const results = await Promise.all(
      GUILD_COLLECTIONS.map(async (col) => {
        try {
          const docs = await mhcatDb.collection(col).find({ guild: GuildId }).toArray();
          return [col, docs];
        } catch (e) {
          console.error(`[backup] collection ${col} error:`, e.message);
          return [col, []];
        }
      })
    );

    // 只保留有資料的 collection
    const collections = Object.fromEntries(
      results.filter(([, docs]) => docs.length > 0)
    );

    const backup = {
      exported_at: new Date().toISOString(),
      guild_id: GuildId,
      collections,
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mhcat-backup-${GuildId}.json"`
    );
    return res.status(200).json(backup);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
