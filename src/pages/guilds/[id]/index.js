/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from "next/router";
import { ReactElement, useEffect, useContext } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Box,
  Flex,
} from "@nextui-org/react";
import { useState } from "react";
import { GetUserGuilds } from "../../../util/fetchapi/GetUserGuilds";
import { BiErrorCircle } from "react-icons/bi";
import Link from "next/link";
import {BsDiscord} from 'react-icons/bs'
import {AiFillHome} from 'react-icons/ai'
import { getSession } from "next-auth/react";

export default function GuildsPage(data) {
  //如果是403狀態就跳轉回主頁
  const router = useRouter();
  if(data.status === '403') return router.push('/');

  const [hasPermission, sethasPermission] = useState(false);
  const isFound = data.guild.some((element) => {
    if (element.id === router.query.id) {
      return true;
    }
    return false;
  });

  if (!hasPermission) {
    if (!isFound) {
      sethasPermission(true);
      return;
    }
  }

  return (
    <Modal blur preventClose aria-labelledby="modal-title" open={hasPermission}>
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
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if(!session) return {
    props: {
      status: '403'
    }
  }
  const guildsData = await GetUserGuilds(session.accessToken,session.id, );
  return {
    props: {
      status: '200',
      guild: guildsData
    }
  }
}