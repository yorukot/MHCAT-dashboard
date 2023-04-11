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
} from "@nextui-org/react";
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
import {TbMessage} from 'react-icons/tb'
import {BiUserPlus} from 'react-icons/bi'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function GuildsPage(guildData) {
  //如果是403狀態就跳轉回主頁
  const router = useRouter();
  if (guildData.status === "401") return router.push("/");

  const [hasPermission, sethasPermission] = useState(
    guildData.status === "403" ? true : false
  );
  const [hasGuild, sethasGuild] = useState(
    guildData.status === "404" ? true : false
  );

  const [Channel, setChannel] = React.useState(); //
  const [Role, setRole] = React.useState();

  

  const roles = guildData.guild.roles
  const channels = [];
  guildData.guild.channels.map((data) => {
    if (data.type === 4) {
      data.channels.map((channelData) => {
        if ([0, 5].includes(channelData.type)) {
          channels.push({
            categorie: data.name,
            id: channelData.id,
            name: channelData.name,
          });
        }
      });
    } else if ([0, 5].includes(data.type)) {
      channels.push({
        categorie: "無類別的頻道",
        id: data.id,
        name: data.name,
      });
    }
  });
  return (
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
            <Text size="$md">選擇你的歡迎訊息要放在哪裡</Text>
            <Autocomplete
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
              sx={{ width: { xs: "100%", sm: "400px" }, padding: "10px 0px" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="請選擇歡迎訊息要在哪裡"
                  placeholder="選擇一個頻道"
                />
              )}
            />
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
              isOptionEqualToValue={(roles, value) =>
                roles.id === value.id
              }
              id="grouped-demo"
              options={roles}
              groupBy={(roles) => roles.categorie}
              getOptionLabel={(roles) => roles.name}
              getOptionDisabled={(roles) =>
                roles.id === guildData.guild.roles[guildData.guild.roles.length -1].id
              }
              onChange={(event, newValue) => {
                setRole(newValue);
              }}
              disableCloseOnSelect
              sx={{ width: { xs: "100%", sm: "400px" }, padding: "10px 0px" }}
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
      <Modal blur preventClose aria-labelledby="modal-title" open={hasGuild}>
        <Modal.Header css={{ alignContent: "center", justifyItems: "center" }}>
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
        <Modal.Header css={{ alignContent: "center", justifyItems: "center" }}>
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
  );
}

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const session = await getSession(ctx);
  if (!session)
    return {
      props: {
        status: "401",
      },
    };
  const guildsData = await GetUserGuilds(session.id);
  const isFound = guildsData.some((element) => {
    if (element.id === query.id) {
      return true;
    }
    return false;
  });
  if (isFound) {
    const GuildData = await GetGuild(session.id, query.id);
    return {
      props: {
        status: `${GuildData.status === "404" ? "404" : "200"}`,
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
