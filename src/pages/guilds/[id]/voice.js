/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import {
  Col,
  Avatar,
  Card,
  Text,
  Button,
  Modal,
  Row,
  Spacer,
  Collapse,
  Popover,
  Switch,
} from '@nextui-org/react';
import { HexColorPicker } from 'react-colorful';
import AlertTitle from '@mui/material/AlertTitle';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
import { GetUserGuilds } from '../../../util/fetchapi/GetUserGuilds';
import { BiErrorCircle } from 'react-icons/bi';
import Link from 'next/link';
import { BsDiscord } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { getSession } from 'next-auth/react';
import { GetGuild } from '../../../util/fetchapi/GetGuild';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React from 'react';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import { TbMessage } from 'react-icons/tb';
import { BiUserPlus } from 'react-icons/bi';
import GetRedisUserGuilds from '../../../util/redis/GetRedisUserGuilds';
import GetRedisGuild from '../../../util/redis/GetRedisGuild';
import { FiCheck } from 'react-icons/fi';
import { RxCross2 } from 'react-icons/rx';
import { validateHTMLColorHex } from 'validate-color';
import { Divider } from '@nextui-org/react';
import { SaveWelcomeData } from '../../../util/saveData.js/WelcomeData/SaveWelcomeData';
import isImageURL from 'is-image-url';
import { GetWelcomeData } from '../../../util/fetchapi/MongodbData/getWelcomeData';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { GetVoiceData } from '../../../util/fetchapi/MongodbData/getVoiceData';
import { SaveVoiceDetectionData } from '../../../util/saveData.js/VoiceData/SaveVoiceDetectionData';
import {MdKeyboardVoice} from 'react-icons/md'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function GuildsPage(guildData) {
  const { data: session, status } = useSession();
  //如果是403狀態就跳轉回主頁
  const router = useRouter();
  if (guildData.status === '401') return router.push('/');

  const [hasPermission] = useState(guildData.status === '403' ? true : false);
  const [hasGuild] = useState(guildData.status === '404' ? true : false);
  const [VoiceData, setVoiceData] = useState();
  const [channels, setChannels] = useState();
  useEffect(() => {
    if (['404', '403', '401'].includes(guildData.status)) return;
    const fetchData = async () => {
      const guildsData = await GetVoiceData(
        session.id,
        router.query.id,
        session.accessToken
      );
      setVoiceData(guildsData);
    };
    if (session) {
      fetchData();
    }
  }, [session]);
  useEffect(() => {
    if (['404', '403', '401'].includes(guildData.status)) return;
    const channels_array = [];
    guildData.guild.channels.map((data) => {
      if (data.type === 4) {
        data.channels.map((channelData) => {
          if ([0].includes(channelData.type)) {
            channels_array.push({
              categorie: data.name,
              id: channelData.id,
              name: channelData.name,
            });
          }
        });
      } else if ([0].includes(data.type)) {
        channels_array.push({
          categorie: '無類別的頻道',
          id: data.id,
          name: data.name,
        });
      }
    });
    setChannels(channels_array);
    setenableVoiceDetection(VoiceData?.voice_detection ? true : false);
    setChannel(
      channels_array.find((obj) => obj.id === VoiceData?.voice_detection)
    );
  }, [VoiceData]);
  const [enableVoiceDetection, setenableVoiceDetection] = useState();
  const [Channel, setChannel] = useState();
  const [VoiceSaveingData, setVoiceSaveingData] = useState(false);
  const [changeVoiceData, setchangeVoiceData] = useState(false);
  const [SuccessSaveData, setSuccessSaveData] = useState();
  useEffect(() => {
    if (!Channel?.id ? true : false) return setchangeVoiceData(false);
    if (
      Channel?.id !==
        channels?.find((obj) => obj.id === VoiceData?.voice_detection)?.id ||
      enableVoiceDetection !== (VoiceData?.voice_detection ? true : false)
    ) {
      setchangeVoiceData(true);
    } else {
      setchangeVoiceData(false);
    }
  }, [Channel, enableVoiceDetection]);
  const defChannel =
    channels?.find((obj) => obj.id === VoiceData?.voice_detection) || null;
  function saveWelcomeData() {
    setVoiceSaveingData(true);
    const data = {
      guild: router.query.id,
      enable: enableVoiceDetection,
      channel: Channel.id,
    };
    const SaveData = async () => {
      const voiceData = await SaveVoiceDetectionData(
        session.id,
        session.accessToken,
        router.query.id,
        data
      );
      setVoiceData(voiceData);
      setVoiceSaveingData(false);
      setSuccessSaveData(true);
      setTimeout(() => {
        setSuccessSaveData(false);
      }, 2000);
    };
    SaveData();
  }
  return (
    <>
      <Snackbar
        open={SuccessSaveData}
        autoHideDuration={2000}
        sx={{ width: '95%' }}
        TransitionComponent={TransitionUp}
      >
        <Alert variant="filled" severity="success" sx={{ width: '100%' }}>
          成功儲存設定!
        </Alert>
      </Snackbar>
      {VoiceData ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Text
              h1
              size={40}
              css={{
                textGradient: '45deg, $yellow600 -20%, $red600 100%',
              }}
              weight="bold"
            >
              語音系統
            </Text>
            <Stack spacing={2}>
              {/*歡迎訊息*/}

              <Collapse
                shadow
                title="自動傳送語音頻道連結"
                subtitle="當有人在某個頻道發送一個訊息時，我會自動幫他發送他目前所在語音頻道的連結喔!!"
                contentLeft={
                  <Avatar
                    size="lg"
                    icon={<MdKeyboardVoice size={25}></MdKeyboardVoice>}
                    bordered
                    squared
                  />
                }
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <Switch
                      checked={VoiceData.voice_detection ? true : false}
                      onChange={() =>
                        setenableVoiceDetection(
                          enableVoiceDetection ? false : true
                        )
                      }
                      iconOn={<FiCheck />}
                      iconOff={<RxCross2 />}
                      size="md"
                    />
                    <Text size="$md">是否啟用此功能</Text>
                  </Stack>
                  <Divider />
                  <Text size="$md">選擇你要偵測的頻道</Text>
                  <Autocomplete
                    disabled={!enableVoiceDetection}
                    isOptionEqualToValue={(channels, value) =>
                      channels.id === value.id
                    }
                    id="grouped-demo"
                    options={channels}
                    groupBy={(channels) => channels.categorie}
                    getOptionLabel={(channels) => channels.name}
                    onChange={(event, newValue) => {
                      setChannel(newValue);
                    }}
                    defaultValue={defChannel}
                    sx={{
                      width: { xs: '100%', sm: '400px' },
                    }}
                    renderInput={(params) => (
                      <TextField
                        error={!Channel?.id ? true : false}
                        variant="outlined"
                        {...params}
                        label="請選擇要偵測的頻道"
                        placeholder="選擇一個頻道"
                      />
                    )}
                  />
                  <Divider />
                  <Button
                    disabled={
                      VoiceSaveingData === true ? true : !changeVoiceData
                    }
                    color="primary"
                    auto
                    css={{ width: '100px' }}
                    onPress={() => saveWelcomeData()}
                  >
                    {VoiceSaveingData ? (
                      <CircularProgress size={20} />
                    ) : (
                      '儲存設定'
                    )}
                  </Button>
                </Stack>
              </Collapse>
            </Stack>
          </Box>
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: '100vh' }}
        >
          <CircularProgress />
          <Modal
            blur
            preventClose
            aria-labelledby="modal-title"
            open={hasGuild}
          >
            <Modal.Header
              css={{ alignContent: 'center', justifyItems: 'center' }}
            >
              <Text id="modal-title" size={18}>
                我找不到這個伺服器QQ
              </Text>
            </Modal.Header>
            <Modal.Body css={{ textAlign: 'center' }}>
              <Text id="modal-title" size={15}>
                麻煩請先將我放到你的伺服器裡呦!
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Link
                href="https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=bot%20applications.commands"
                target="_blank"
                style={{ width: '100%' }}
              >
                <Button
                  auto
                  icon={<BsDiscord fill="currentColor" />}
                  css={{ width: '100%', backgroundColor: '#5765f2' }}
                >
                  立即邀請我到你的伺服器
                </Button>
              </Link>
              <Link href="/" style={{ width: '100%' }}>
                <Button
                  auto
                  color="warning"
                  icon={<AiFillHome fill="currentColor" />}
                  css={{ width: '100%' }}
                >
                  返回選擇頁面
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
          <Modal
            blur
            preventClose
            aria-labelledby="modal-title"
            open={hasPermission}
          >
            <Modal.Header
              css={{ alignContent: 'center', justifyItems: 'center' }}
            >
              <BiErrorCircle size={22}></BiErrorCircle>
              <Text id="modal-title" size={18}>
                找不到這個伺服器!
              </Text>
            </Modal.Header>
            <Modal.Body css={{ textAlign: 'center' }}>
              <Text id="modal-title" size={15}>
                可能是因為你沒有權限讀取這個伺服器喔
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Link href="https://discord.gg/7g7VE2Sqna" target="_blank">
                <Button
                  shadow
                  color="secondary"
                  auto
                  icon={<BsDiscord fill="currentColor" />}
                >
                  回報錯誤
                </Button>
              </Link>
              <Link href="/">
                <Button
                  shadow
                  color="primary"
                  auto
                  icon={<AiFillHome fill="currentColor" />}
                >
                  重新選擇
                </Button>
              </Link>
            </Modal.Footer>
          </Modal>
        </Grid>
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  //確認使用者是否有登入
  const session = await getSession(ctx);
  if (!session)
    return {
      props: {
        status: '401',
      },
    };
  //確認使用者是否有權限使用管理該伺服器
  const guildsData = await GetRedisUserGuilds(session.id);
  const isFound = guildsData.some((element) => {
    if (element.id === query.id) {
      return true;
    }
    return false;
  });
  if (isFound) {
    const GuildData = await GetRedisGuild(session.id, query.id);
    //尋找之前的資料
    return {
      props: {
        status: `${GuildData.status === '404' ? '404' : '200'}`,
        guild: GuildData.GuildData,
      },
    };
  } else {
    return {
      props: {
        status: '403',
      },
    };
  }
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
