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
  Input,
  Popper,
} from "@nextui-org/react";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Unstable_Grid2";
import { useState } from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { GetGuild } from "../../../util/fetchapi/GetGuild";
import { BsFillDoorOpenFill, BsDiscord } from "react-icons/bs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import React from "react";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import { TbMessage } from "react-icons/tb";
import { BiErrorCircle, BiUserPlus } from "react-icons/bi";
import GetRedisUserGuilds from "../../../util/redis/GetRedisUserGuilds";
import GetRedisGuild from "../../../util/redis/GetRedisGuild";
import { FiCheck } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { validateHTMLColorHex } from "validate-color";
import { Divider } from "@nextui-org/react";
import { SaveWelcomeData } from "../../../util/saveData.js/WelcomeData/SaveWelcomeData";
import isImageURL from "is-image-url";
import { GetWelcomeData } from "../../../util/fetchapi/MongodbData/getWelcomeData";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { GetWorkListData } from "../../../util/fetchapi/MongodbData/getWorkListData";
import { Table } from "@nextui-org/react";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiFillEye, AiFillHome } from "react-icons/ai";
import AlertTitle from "@mui/material/AlertTitle";
import { MdDelete } from "react-icons/md";
import { RiSave2Fill } from "react-icons/ri";
import { UpdateWorkData } from "../../../util/saveData.js/WorkData/UpdateWorkData";
import { DeleteWorkData } from "../../../util/saveData.js/WorkData/DeleteWorkData";
import { CreateWorkData } from "../../../util/saveData.js/WorkData/CreateWorkData";
import {AiOutlineFileAdd} from 'react-icons/ai'

export default function GuildsPage(guildData) {
  console.log(guildData)
  const fetchData = async () => {
    const WorkSomethingData = await GetWorkListData(
      session.id,
      router.query.id,
      session.accessToken
    );
    setWorkList(WorkSomethingData);
  };
  //取得session
  const { data: session, status } = useSession();
  //取得路由
  const router = useRouter();
  //設置取得data的資料
  const [WorkList, setWorkList] = useState();
  //確認使用者權限
  if (guildData.status === "401") return router.push("/");

  const [hasPermission] = useState(guildData.status === "403" ? true : false);
  const [hasGuild] = useState(guildData.status === "404" ? true : false);
  //獲取Data資料
  useEffect(() => {
    if (["404", "403", "401"].includes(guildData.status)) return;
    if (session) {
      fetchData();
    }
  }, [session]);
  //設置成功儲存的警報是否顯示
  const [SuccessSaveData, setSuccessSaveData] = useState(false);
  //設置是否正在儲存
  const [SaveingData, setSaveingData] = useState(false);

  const [ModalData, setModalData] = useState();
  //設置是否要ShowModal
  const [ShowModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };
  //Discord伺服器的身分組
  const [Roles, setRoles] = useState();
  //玩家選取的身分組
  useEffect(() => {
    setRoles(guildData.guild.roles);
  }, [guildData]);
  //設定work的設定Data
  const [Name, setName] = useState("");
  const [Time, setTime] = useState("");
  const [Energy, setEnergy] = useState("");
  const [Coin, setCoin] = useState("");
  const [Role, setRole] = useState();
  //設定是否允許更改
  const [Save, setSave] = useState(true);

  useEffect(() => {
    if (
      (!WorkList?.find((obj) => obj.name === Name) ||
        Name === ModalData?.data?.name) &&
      Name.length > 0 &&
      Time > 0 &&
      Energy > 0 &&
      Coin > 0 &&
      (Name !== ModalData?.data?.name ||
        Time !== ModalData?.data?.time ||
        Energy !== ModalData?.data?.energy ||
        Coin !== ModalData?.data?.coin ||
        Role?.id !== ModalData?.data?.role)
    ) {
      setSave(false);
    } else {
      setSave(true);
    }
  }, [Name, Time, Energy, Coin, Role, ShowModal]);

  function DeleteData() {
    setSaveingData(true);
    const SaveData = async () => {
      const WorkData = await DeleteWorkData(
        session.id,
        session.accessToken,
        router.query.id,
        ModalData.data.name
      );

      fetchData();

      setSaveingData(false);
      setShowModal(false);
      setSuccessSaveData(true);
      setTimeout(() => {
        setSuccessSaveData(false);
      }, 2000);
    };
    SaveData();
  }
  function UpdateData() {
    setSaveingData(true);
    const SaveData = async () => {
      const WorkData = await UpdateWorkData(
        session.id,
        session.accessToken,
        router.query.id,
        {
          guild: router.query.id,
          name: Name,
          time: Time,
          energy: Energy,
          coin: Coin,
          role: Role?.id || null,
        },
        ModalData.data.name
      );

      fetchData();

      setSaveingData(false);
      setShowModal(false);
      setSuccessSaveData(true);
      setTimeout(() => {
        setSuccessSaveData(false);
      }, 2000);
    };
    SaveData();
  }
  function CreateData() {
    setSaveingData(true);
    const SaveData = async () => {
      const WorkData = await CreateWorkData(session.id, session.accessToken, {
        guild: router.query.id,
        name: Name,
        time: Time,
        energy: Energy,
        coin: Coin,
        role: Role?.id || null,
      });

      fetchData();

      setSaveingData(false);
      setShowModal(false);
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
        sx={{ width: "95%" }}
        TransitionComponent={TransitionUp}
      >
        <Alert variant="filled" severity="success" sx={{ width: "100%" }}>
          成功儲存設定!
        </Alert>
      </Snackbar>
      {WorkList ? (
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
              打工系統設置
            </Text>
            <Stack spacing={2}>
              <Button
                color="gradient"
                auto
                disabled={WorkList.length > 19}
                css={{ width: "100px" }}
                onPress={() => {
                  setName("");
                  setTime("");
                  setCoin("");
                  setEnergy("");
                  setRole(null);
                  setModalData({ do: "create" });
                  setShowModal(true);
                }}
              >
                <AiOutlineFileAdd/>創建新的打工
              </Button>
              {WorkList.length > 19 ? (
                <Alert variant="outlined" severity="warning">
                  很抱歉!你的打工數量已經到達上限
                </Alert>
              ) : (
                <></>
              )}
              <Table
                aria-label="WorkList Table"
                bordered
                shadow={false}
                css={{
                  height: "auto",
                  minWidth: "100%",
                }}
              >
                <Table.Header>
                  <Table.Column>打工名稱</Table.Column>
                  <Table.Column>獲得代幣</Table.Column>
                  <Table.Column>操作</Table.Column>
                </Table.Header>
                <Table.Body>
                  {WorkList.map((workdata) => {
                    return (
                      <Table.Row key={workdata.name}>
                        <Table.Cell>{workdata.name}</Table.Cell>
                        <Table.Cell>{workdata.coin}</Table.Cell>
                        <Table.Cell>
                          <Stack direction="row" spacing={0}>
                            <Button
                              onPress={() => {
                                setName(workdata.name);
                                setTime(workdata.time);
                                setCoin(workdata.coin);
                                setEnergy(workdata.energy);
                                setRole(
                                  Roles?.find(
                                    (roledata) => roledata.id === workdata.role
                                  ) || null
                                );
                                setModalData({ data: workdata, do: "edit" });
                                setShowModal(true);
                              }}
                              color="warning"
                              iconRight={<BiEdit />}
                              auto
                              light
                              ripple={false}
                              style={{ width: "30px" }}
                            />
                            <Button
                              onPress={() => {
                                setModalData({ data: workdata, do: "delete" });
                                setShowModal(true);
                              }}
                              color="error"
                              iconRight={<RiDeleteBinLine />}
                              auto
                              light
                              ripple={false}
                              style={{ width: "30px" }}
                            />
                          </Stack>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </Stack>
          </Box>

          <Modal
            closeButton
            aria-labelledby="modal-title"
            open={ShowModal}
            onClose={closeModal}
          >
            {ModalData?.do !== "delete" ? (
              <>
                <Modal.Header>
                  <Text h3 weight="bold">
                    打工資料
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Text h5 weight="bold">
                    打工地點的名稱
                  </Text>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    status={`${
                      Name.length <= 0 ||
                      (WorkList.find((obj) => obj.name === Name) &&
                        Name !== ModalData?.data?.name)
                        ? "error"
                        : "default"
                    }`}
                    helperText={`${
                      Name.length <= 0
                        ? "必須要有打工地點名稱!"
                        : WorkList.find((obj) => obj.name === Name) &&
                          Name !== ModalData?.data?.name
                        ? "打工地點名稱不可重複!"
                        : ""
                    }`}
                    id="EditDataName"
                    bordered
                    color="primary"
                    initialValue={ModalData?.data?.name}
                  />
                  <Text h5 weight="bold">
                    打工所需時間(單位:小時)
                  </Text>
                  <Input
                    onChange={(e) => setTime(e.target.value)}
                    status={`${Time <= 0 ? "error" : "default"}`}
                    helperText={`${Time <= 0 ? "必須大於0!" : ""}`}
                    id="EditDataTime"
                    bordered
                    labelRight="Hr"
                    color="primary"
                    type="number"
                    initialValue={ModalData?.data?.time}
                  />
                  <Text h5 weight="bold">
                    打工所需精力
                  </Text>
                  <Input
                    onChange={(e) => setEnergy(e.target.value)}
                    status={`${Energy <= 0 ? "error" : "default"}`}
                    helperText={`${Energy <= 0 ? "必須大於0!" : ""}`}
                    id="EditDataEnergy"
                    bordered
                    color="primary"
                    type="number"
                    initialValue={ModalData?.data?.energy}
                  />
                  <Text h5 weight="bold">
                    打工可獲得多少代幣
                  </Text>
                  <Input
                    onChange={(e) => setCoin(e.target.value)}
                    status={`${Coin <= 0 ? "error" : "default"}`}
                    helperText={`${Coin <= 0 ? "必須大於0!" : ""}`}
                    id="EditDataCoin"
                    bordered
                    color="primary"
                    type="number"
                    initialValue={ModalData?.data?.coin}
                  />
                  <Text h5 weight="bold">
                    打工所需身分組(選填)
                  </Text>

                  <Autocomplete
                    defaultValue={Role}
                    id="grouped-demo"
                    options={Roles}
                    getOptionLabel={(Roles) => Roles.name}
                    onChange={(event, newValue) => {
                      setRole(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ color: `${"#" + Role?.color.toString(16)}` }}
                        {...params}
                        label="請選取要給甚麼身分組(選填)"
                        placeholder="選擇身分組"
                      />
                    )}
                    disablePortal
                    renderOption={(props, option) => {
                      return (
                        <span {...props}>
                          <div
                            style={{
                              color: `${"#" + option.color.toString(16)}`,
                            }}
                          >
                            {option.name}
                          </div>
                        </span>
                      );
                    }}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    auto
                    color="error"
                    onPress={closeModal}
                    icon={<RxCross2 />}
                  >
                    關閉
                  </Button>
                  <Button
                    auto
                    onPress={() =>
                      ModalData?.do === "create" ? CreateData() : UpdateData()
                    }
                    icon={<RiSave2Fill />}
                    disabled={SaveingData || Save}
                  >
                    {SaveingData ? <CircularProgress size={20} /> : "儲存"}
                  </Button>
                </Modal.Footer>
              </>
            ) : (
              <>
                <Modal.Header>
                  <Stack spacing={2}>
                    <Text h3 weight="bold">
                      你是否確認刪除<strong>{ModalData.data.name}</strong>?
                      <br></br>
                    </Text>
                    <Alert severity="warning">
                      <AlertTitle>
                        <strong>警告</strong>!一旦刪除將無法復原
                      </AlertTitle>
                    </Alert>
                  </Stack>
                </Modal.Header>
                <Modal.Footer>
                  <Button
                    auto
                    color="error"
                    onPress={closeModal}
                    icon={<RxCross2 />}
                  >
                    取消
                  </Button>
                  <Button
                    auto
                    disabled={SaveingData}
                    color="warning"
                    onPress={() => {
                      DeleteData();
                    }}
                    icon={<MdDelete />}
                  >
                    {SaveingData ? <CircularProgress size={20} /> : "刪除"}
                  </Button>
                </Modal.Footer>
              </>
            )}
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

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
