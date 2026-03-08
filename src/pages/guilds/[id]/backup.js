/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { getSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Card,
  Text,
  Button,
  Modal,
  Collapse,
} from '@nextui-org/react';
import Link from 'next/link';
import { BsDiscord } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';
import { MdDownload } from 'react-icons/md';
import GetRedisUserGuilds from '../../../util/redis/GetRedisUserGuilds';
import GetRedisGuild from '../../../util/redis/GetRedisGuild';

const GUILD_COLLECTIONS = [
  'ann_all_sets', 'birthdays', 'birthday_sets', 'btns', 'chats', 'chat_roles',
  'chatgpts', 'chatgpt_gets', 'coins', 'create_hours', 'cron_sets', 'errors_sets',
  'ghps', 'gifts', 'gift_changes', 'good_webs', 'guilds', 'join_messages',
  'join_roles', 'leave_messages', 'lock_channels', 'loggings', 'lotters',
  'message_reactions', 'message_reaction', 'numbers', 'polls', 'role_numbers', 'sign_lists',
  'text_xps', 'text_xp_channels', 'tickets', 'verifications', 'voice_channels',
  'voice_channel_ids', 'voice_roles', 'voice_xps', 'voice_xp_channels', 'votes',
  'warndbs', 'work_sets', 'work_somethings', 'work_users',
];

export default function BackupPage(pageData) {
  const { data: session } = useSession();
  const router = useRouter();

  if (pageData.status === '401') return router.push('/');

  const [hasPermission] = useState(pageData.status === '403');
  const [hasGuild] = useState(pageData.status === '404');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloaded, setDownloaded] = useState(null); // 下載後的 collection 名稱列表

  async function handleDownload() {
    if (!session) return;
    setLoading(true);
    setError(null);
    setDownloaded(null);

    try {
      const res = await fetch(`/api/backup/${router.query.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userid: session.id,
          UserAccessToken: session.accessToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || '備份失敗，請稍後再試');
        return;
      }

      const backup = await res.json();
      const downloadedCols = [];

      // 依 API 回傳的 collections（只有有資料的）各自觸發下載
      // 每次下載之間加延遲，避免 Safari 等瀏覽器封鎖連續下載
      for (const [col, docs] of Object.entries(backup.collections)) {
        if (!docs || docs.length === 0) continue;
        const blob = new Blob([JSON.stringify(docs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${col}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        downloadedCols.push(col);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setDownloaded(downloadedCols);
    } catch (e) {
      setError('備份時發生錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  }

  const importCommands = GUILD_COLLECTIONS.map(
    (col) => `mongoimport --uri "YOUR_MONGO_URI" --db mhcat-database --collection ${col.padEnd(20)} --jsonArray --file ${col}.json`
  ).join('\n');

  return (
    <>
      <Box sx={{ maxWidth: 700 }}>
        <Text
          h1
          size={40}
          css={{ textGradient: '45deg, $blue600 -20%, $cyan600 100%' }}
          weight="bold"
        >
          資料備份
        </Text>

        <Stack spacing={2}>
          <Alert variant="outlined" severity="warning">
            <AlertTitle>服務即將關閉</AlertTitle>
            MHCAT 即將停止服務。請在服務關閉前將你的伺服器資料備份下來。
            點擊下方按鈕後，伺服器所有資料會依 MongoDB collection 各自下載為獨立的 JSON 檔案，
            可直接使用 <code>mongoimport</code> 導入到新的 MongoDB 上。
          </Alert>

          <Alert variant="filled" severity="error">
            <AlertTitle>個人資料警告</AlertTitle>
            備份檔案包含伺服器成員的個人資料（如 Discord user ID、生日、違規記錄等）。
            請依照你所在地區的個資法規妥善保管，不得對外分享或作為其他用途使用。
          </Alert>

          <Card css={{ padding: '$8' }}>
            <Card.Body>
              <Stack spacing={2}>
                <Text size="$lg" weight="semibold">備份範圍</Text>
                <Text size="$sm" color="$accents7">
                  涵蓋所有與你的伺服器相關的資料，包含：公告、生日、打工、硬幣、投票、警告、
                  歡迎/離開訊息、語音頻道、文字/語音經驗、抽獎、票務系統、ChatGPT 設定⋯等共 {GUILD_COLLECTIONS.length} 個 collection。
                  只有包含資料的 collection 才會被下載。
                </Text>

                {error && <Alert severity="error">{error}</Alert>}

                {downloaded !== null && (
                  <Alert severity="success">
                    <AlertTitle>備份完成</AlertTitle>
                    已下載 {downloaded.length} 個 collection：{downloaded.join('、')}
                  </Alert>
                )}

                <Button
                  color="primary"
                  auto
                  icon={loading ? <CircularProgress size={16} /> : <MdDownload size={18} />}
                  disabled={loading}
                  onPress={handleDownload}
                  css={{ width: 'fit-content' }}
                >
                  {loading ? '備份中...' : '下載備份'}
                </Button>
              </Stack>
            </Card.Body>
          </Card>

          <Collapse
            shadow
            title="如何還原到新的 MongoDB？"
            subtitle="使用 mongoimport 指令匯入備份檔案"
          >
            <Stack spacing={1.5}>
              <Text size="$sm" color="$accents7">
                將下載的所有 JSON 檔案放在同一個目錄，執行以下指令（將 <code>YOUR_MONGO_URI</code> 替換為你的連線字串）：
              </Text>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#1a1a1a',
                  color: '#e0e0e0',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  overflowX: 'auto',
                  lineHeight: 1.9,
                }}
              >
                {importCommands}
              </Box>
              <Alert severity="info" variant="outlined">
                如果是全新的 MongoDB，直接執行上述指令即可。
                若要覆蓋現有資料，可在每行指令後加上 <code>--mode upsert</code>。
              </Alert>
            </Stack>
          </Collapse>
        </Stack>
      </Box>

      {/* 機器人不在伺服器 Modal */}
      <Modal blur preventClose aria-labelledby="modal-title" open={hasGuild}>
        <Modal.Header css={{ alignContent: 'center', justifyItems: 'center' }}>
          <Text id="modal-title" size={18}>我找不到這個伺服器QQ</Text>
        </Modal.Header>
        <Modal.Body css={{ textAlign: 'center' }}>
          <Text size={15}>麻煩請先將我放到你的伺服器裡呦!</Text>
        </Modal.Body>
        <Modal.Footer>
          <Link href="https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=bot%20applications.commands" target="_blank" style={{ width: '100%' }}>
            <Button auto icon={<BsDiscord fill="currentColor" />} css={{ width: '100%', backgroundColor: '#5765f2' }}>
              立即邀請我到你的伺服器
            </Button>
          </Link>
          <Link href="/" style={{ width: '100%' }}>
            <Button auto color="warning" icon={<AiFillHome fill="currentColor" />} css={{ width: '100%' }}>
              返回選擇頁面
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>

      {/* 無權限 Modal */}
      <Modal blur preventClose aria-labelledby="modal-title" open={hasPermission}>
        <Modal.Header css={{ alignContent: 'center', justifyItems: 'center' }}>
          <BiErrorCircle size={22} />
          <Text id="modal-title" size={18}>找不到這個伺服器!</Text>
        </Modal.Header>
        <Modal.Body css={{ textAlign: 'center' }}>
          <Text size={15}>可能是因為你沒有權限讀取這個伺服器喔</Text>
        </Modal.Body>
        <Modal.Footer>
          <Link href="https://discord.gg/7g7VE2Sqna" target="_blank">
            <Button shadow color="secondary" auto icon={<BsDiscord fill="currentColor" />}>
              回報錯誤
            </Button>
          </Link>
          <Link href="/">
            <Button shadow color="primary" auto icon={<AiFillHome fill="currentColor" />}>
              重新選擇
            </Button>
          </Link>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const session = await getSession(ctx);
  if (!session) return { props: { status: '401' } };

  const guildsData = await GetRedisUserGuilds(session.id);
  const isFound = guildsData.some((element) => element.id === query.id);

  if (isFound) {
    const GuildData = await GetRedisGuild(session.id, query.id);
    return {
      props: {
        status: GuildData.status === '404' ? '404' : '200',
      },
    };
  } else {
    return { props: { status: '403' } };
  }
}
