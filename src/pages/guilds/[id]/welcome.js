/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import { ReactElement, useEffect, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
} from "@nextui-org/react";
import { HexColorPicker } from "react-colorful";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import { GetUserGuilds } from "../../../util/fetchapi/GetUserGuilds";
import { BiErrorCircle } from "react-icons/bi";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { AiFillHome } from "react-icons/ai";
import { getSession } from "next-auth/react";
import { GetGuild } from "../../../util/fetchapi/GetGuild";
import { BsFillDoorOpenFill } from "react-icons/bs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { TbMessage } from "react-icons/tb";
import { BiUserPlus } from "react-icons/bi";
import GetRedisUserGuilds from "../../../util/redis/GetRedisUserGuilds";
import GetRedisGuild from "../../../util/redis/GetRedisGuild";
import { JoinMessage } from "../../../util/schemas";
import { FiCheck } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { validateHTMLColorHex } from "validate-color";
import { Divider } from "@nextui-org/react";
import { SaveWelcomeData } from "../../../util/saveData.js/SaveWelcomeData";
import isImageURL from "is-image-url";
import { GetWelcomeData } from "../../../util/fetchapi/MongodbData/getWelcomeData";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from '@mui/material/Snackbar';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function GuildsPage(guildData) {
  const { data: session, status } = useSession();
  //如果是403狀態就跳轉回主頁
  const router = useRouter();
  if (guildData.status === "401") return router.push("/");

  const [hasPermission] = useState(guildData.status === "403" ? true : false);
  const [hasGuild] = useState(guildData.status === "404" ? true : false);
  const [JoinMessage, setJoinMessage] = useState();
  const [channels, setChannels] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const guildsData = await GetWelcomeData(
        session.id,
        router.query.id,
        session.accessToken
      );
      setJoinMessage(guildsData);
    };
    if (session) {
      fetchData();
    }
  }, [session]);
  const roles = guildData.guild.roles;
  useEffect(() => {
    const channels_array = [];
    guildData.guild.channels.map((data) => {
      if (data.type === 4) {
        data.channels.map((channelData) => {
          if ([0, 5].includes(channelData.type)) {
            channels_array.push({
              categorie: data.name,
              id: channelData.id,
              name: channelData.name,
            });
          }
        });
      } else if ([0, 5].includes(data.type)) {
        channels_array.push({
          categorie: "無類別的頻道",
          id: data.id,
          name: data.name,
        });
      }
    });
    setChannels(channels_array);
    setColor(validateHTMLColorHex(JoinMessage?.color) || `#fff`);
    setenableWelcome(JoinMessage?.enable || false);
    setRandom(!validateHTMLColorHex(JoinMessage?.color));
    setImgUrl(JoinMessage?.img);
    setChannel(channels_array.find((obj) => obj.id === JoinMessage?.channel));
    setWelcomeContent(
      `${JoinMessage?.message_content || "歡迎{tag}加入我們!"}`
    );
  }, [JoinMessage]);
  const [color, setColor] = useState();
  const [enableWelcome, setenableWelcome] = useState();
  const [Random, setRandom] = useState();
  const [ImgUrl, setImgUrl] = useState();
  const [Channel, setChannel] = useState();
  const [Role, setRole] = useState();
  const [WelcomeSaveingData, setWelcomeSaveingData] = useState(false);
  const [changeWelcomeData, setChangeWelcomeData] = useState(false);
  const [WelcomeContent, setWelcomeContent] = useState();
  const [SuccessSaveData, setSuccessSaveData] = useState();
  useEffect(() => {
    if (!Channel?.id ? true : false) return setChangeWelcomeData(false);
    if (
      Channel?.id !==
        channels?.find((obj) => obj.id === JoinMessage?.channel)?.id ||
      Random !== !validateHTMLColorHex(JoinMessage?.color) ||
      enableWelcome !== (JoinMessage?.enable || false) ||
      color !== (validateHTMLColorHex(JoinMessage?.color) || `#fff`) ||
      WelcomeContent !== `${JoinMessage?.message_content || "歡迎{tag}加入我們!"}` ||
      ImgUrl !== JoinMessage?.img
    ) {
      setChangeWelcomeData(true);
    } else {
      setChangeWelcomeData(false);
    }
  }, [Channel, Random, enableWelcome, color, WelcomeContent, ImgUrl]);
  const defChannel =
    channels?.find((obj) => obj.id === JoinMessage?.channel) || null;
  function saveWelcomeData() {
    setWelcomeSaveingData(true)
    const data = {
      guild: router.query.id,
      enable: enableWelcome,
      message_content: WelcomeContent,
      color: Random ? "Random" : color,
      channel: Channel.id,
      img: ImgUrl?.length > 0 ? ImgUrl : null,
    };
    const fetchData = async () => {
      const guildsData = await SaveWelcomeData(
        session.id,
        session.accessToken,
        router.query.id,
        data
      );
        setJoinMessage(guildsData)
        setWelcomeSaveingData(false)
        setSuccessSaveData(true)
        setTimeout(() => {
          setSuccessSaveData(false)
        }, 2000);
    };
    fetchData()
  }
  return (
    <>
          <Snackbar open={SuccessSaveData} autoHideDuration={2000} sx={{ width: '100%' }}>
        <Alert severity="success" sx={{ width: '100%' }}>
          成功儲存設定!
        </Alert>
      </Snackbar>
      {JoinMessage ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Text
              h1
              size={40}
              css={{
                textGradient: "45deg, $yellow600 -20%, $red600 100%",
              }}
              weight="bold"
            >
              歡迎&離開系統
            </Text>
            <Stack spacing={2}>
              {/*歡迎訊息*/}

              <Collapse
                shadow
                title="發送歡迎訊息"
                subtitle="為加入你伺服器的使用者發送一個有趣的歡迎消息吧!"
                contentLeft={
                  <Avatar
                    size="lg"
                    icon={<TbMessage size={25}></TbMessage>}
                    bordered
                    squared
                  />
                }
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1}>
                    <Switch
                      checked={enableWelcome}
                      onChange={() =>
                        setenableWelcome(enableWelcome ? false : true)
                      }
                      iconOn={<FiCheck />}
                      iconOff={<RxCross2 />}
                      size="md"
                    />
                    <Text size="$md">是否啟用歡迎訊息</Text>
                  </Stack>
                  <Divider />
                  <Text size="$md">選擇你的歡迎訊息要放在哪裡</Text>
                  <Autocomplete
                    disabled={!enableWelcome}
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
                      width: { xs: "100%", sm: "400px" },
                    }}
                    renderInput={(params) => (
                      <TextField
                        error={!Channel?.id ? true : false}
                        variant="outlined"
                        {...params}
                        label="請選擇歡迎訊息要在哪裡"
                        placeholder="選擇一個頻道"
                      />
                    )}
                  />
                  <Divider />

                  <Text size="$md">請輸入您的消息內容</Text>
                  <TextField
                    disabled={!enableWelcome}
                    id="outlined-textarea"
                    label="請輸入歡迎訊息"
                    sx={{ width: { xs: "100%", sm: "400px" } }}
                    defaultValue={`${
                      JoinMessage?.message_content || "歡迎{tag}加入我們!"
                    }`}
                    onChange={(e) => setWelcomeContent(e.target.value)}
                    multiline
                    rows={5}
                  />
                  <Alert severity="info">
                    <AlertTitle>資訊</AlertTitle>
                    TAG使用者可以使用 <strong>{"{tag}"}</strong>
                    <br />
                    使用者名稱可以使用 <strong>{"{membername}"}</strong>
                  </Alert>
                  <Divider />
                  <Text size="$md">您要顯示在歡迎訊息的圖片(可選)</Text>
                  <TextField
                    error={ImgUrl?.length > 0 ? !isImageURL(ImgUrl) : false}
                    disabled={!enableWelcome}
                    id="outlined-textarea"
                    label="輸入歡迎訊息的圖片URL"
                    sx={{ width: { xs: "100%", sm: "400px" } }}
                    onChange={(data) => setImgUrl(data.target.value)}
                    defaultValue={`${JoinMessage?.img || ""}`}
                    multiline
                  />
                  <Divider />
                  <Text size="$md">
                    是否使用隨機顏色(若不選隨機，請選取一個顏色)
                  </Text>
                  <Stack direction="row" spacing={3}>
                    <Switch
                      disabled={!enableWelcome}
                      checked={Random}
                      onChange={() => setRandom(Random ? false : true)}
                      iconOn={<FiCheck />}
                      iconOff={<RxCross2 />}
                      size="md"
                    />
                    <Popover placement="right">
                      <Popover.Trigger>
                        <Button
                          auto
                          disabled={!enableWelcome === true || Random}
                          css={{
                            backgroundColor: `${color}`,
                            width: "30px",
                            height: "30px",
                            border: "3px solid #fff",
                          }}
                        />
                      </Popover.Trigger>
                      <Popover.Content>
                        <HexColorPicker color={color} onChange={setColor} />
                      </Popover.Content>
                    </Popover>
                  </Stack>
                  <Divider />
                  <Button
                    disabled={WelcomeSaveingData === true ? true : !changeWelcomeData}
                    color="primary"
                    auto
                    css={{ width: "100px" }}
                    onPress={() => saveWelcomeData()}
                  >
                    {WelcomeSaveingData ? <CircularProgress size={20}/> : '儲存設定'}
                  </Button>
                </Stack>
              </Collapse>

              <Collapse
                shadow
                title="給予新成員身分組"
                subtitle="給予一些身分組給剛加進你伺服器的使用者吧!"
                contentLeft={
                  <Avatar
                    size="lg"
                    icon={<BiUserPlus size={25}></BiUserPlus>}
                    bordered
                    squared
                  />
                }
              >
                <Text size="$md">選擇你要給予正常成員哪些身分組</Text>
                <Autocomplete
                  multiple
                  isOptionEqualToValue={(roles, value) => roles.id === value.id}
                  id="grouped-demo"
                  options={roles}
                  groupBy={(roles) => roles.categorie}
                  getOptionLabel={(roles) => roles.name}
                  getOptionDisabled={(roles) =>
                    roles.id ===
                    guildData.guild.roles[guildData.guild.roles.length - 1].id
                  }
                  onChange={(event, newValue) => {
                    setRole(newValue);
                  }}
                  disableCloseOnSelect
                  sx={{
                    width: { xs: "100%", sm: "400px" },
                    padding: "10px 0px",
                  }}
                  renderOption={(props, channels, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {channels.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="請選取要給甚麼身分組(可複選)"
                      placeholder="選擇身分組"
                    />
                  )}
                />
              </Collapse>
            </Stack>
          </Box>

          {
            //我只是個不起的分隔線--------------------------------------------------------------------
          }
          <Modal
            blur
            preventClose
            aria-labelledby="modal-title"
            open={hasGuild}
          >
            <Modal.Header
              css={{ alignContent: "center", justifyItems: "center" }}
            >
              <Text id="modal-title" size={18}>
                我找不到這個伺服器QQ
              </Text>
            </Modal.Header>
            <Modal.Body css={{ textAlign: "center" }}>
              <Text id="modal-title" size={15}>
                麻煩請先將我放到你的伺服器裡呦!
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Link
                href="https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=bot%20applications.commands"
                target="_blank"
                style={{ width: "100%" }}
              >
                <Button
                  auto
                  icon={<BsDiscord fill="currentColor" />}
                  css={{ width: "100%", backgroundColor: "#5765f2" }}
                >
                  立即邀請我到你的伺服器
                </Button>
              </Link>
              <Link href="/" style={{ width: "100%" }}>
                <Button
                  auto
                  color="warning"
                  icon={<AiFillHome fill="currentColor" />}
                  css={{ width: "100%" }}
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
              css={{ alignContent: "center", justifyItems: "center" }}
            >
              <BiErrorCircle size={22}></BiErrorCircle>
              <Text id="modal-title" size={18}>
                找不到這個伺服器!
              </Text>
            </Modal.Header>
            <Modal.Body css={{ textAlign: "center" }}>
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
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <CircularProgress />
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
        status: "401",
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
    const { message_content, color, channel, img, enable } =
      await JoinMessage.findOne({
        guild: query.id,
      });
    return {
      props: {
        status: `${GuildData.status === "404" ? "404" : "200"}`,
        JoinMessage: {
          message_content: message_content || null,
          color: color || null,
          channel: channel || null,
          img: img || null,
          enable: enable || null,
        },
        guild: GuildData.GuildData,
      },
    };
  } else {
    return {
      props: {
        status: "403",
      },
    };
  }
}
