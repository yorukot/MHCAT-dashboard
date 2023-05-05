import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SideBar from "./sideBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import SiderbarInfo from "./SiderbarInfo/index";
import { useSession, signIn, signOut } from "next-auth/react";
import { BsDiscord } from "react-icons/bs";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import { User } from "@nextui-org/react";
import {
  Modal,
  Input,
  Row,
  Checkbox,
  Button,
  Text,
  Flex,
} from "@nextui-org/react";
import MuiLink from "@mui/material/Link";
import {SiKofi} from 'react-icons/si'

const drawerWidth = 270;

export default function AppHeaderBar({ children }) {
  const { data: session, status } = useSession();
  const [open, setSnackBarState] = useState(false);
  const [auth, setAuth] = useState(false);
  const handleClose = () => {
    setSnackBarState(open ? false : true);
  };
  if (!auth && status && status === "unauthenticated") {
    setAuth(true);
    return;
  }
  return (
    <Box sx={{ display: "flex", marginTop: "64px" }}>
      <Modal blur preventClose aria-labelledby="modal-title" open={auth}>
        <Modal.Header css={{ alignContent: "center", justifyItems: "center" }}>
          <Avatar src="https://media.discordapp.net/attachments/991337796960784424/1076133775026700309/fotor_2023-2-17_21_31_7.png?width=160&height=160"></Avatar>
        </Modal.Header>

        <Modal.Body css={{ textAlign: "center" }}>
          <Text id="modal-title" size={18}>
            請選取一個登入方式
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => signIn("discord")}
            color="primary"
            auto
            icon={<BsDiscord />}
            css={{ width: "100%", backgroundColor: "#5765f2" }}
          >
            使用Discord登入
          </Button>
        </Modal.Footer>
      </Modal>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          background: '#212121',
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ display: "flex" }}>
          <Link href="/" underline="none">
            <Avatar
              sx={{ width: 30, height: 30 }}
              variant="square"
              href="/"
              src="https://media.discordapp.net/attachments/991337796960784424/994808276137025637/magicut_1656773580167.png"
            ></Avatar>
          </Link>

          <Typography
            href="/"
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, paddingLeft: "10px" }}
          >
            <strong>MHCAT</strong>
          </Typography>

          <Stack direction="row" spacing={1}>
          <Link href="https://discord.gg/7g7VE2Sqna" target="_blank">
          <MuiLink>
            <Box sx={{ border: "1px solid #c7c7c7", borderRadius: "10px",backgroundColor: "#5765f2"}}>
              <IconButton disableFocusRipple disableRipple aria-label="delete" >
                <BsDiscord />
              </IconButton>
            </Box>
            </MuiLink>
        </Link>
        <Link href="https://ko-fi.com/night_cat" target="_blank">
          <MuiLink>
            <Box sx={{ border: "2px solid #c7c7c7", borderRadius: "10px",}}>
              <IconButton disableFocusRipple disableRipple aria-label="delete" >
                <SiKofi />
              </IconButton>
            </Box>
            </MuiLink>
        </Link>
            <Box>
              <IconButton
                disableFocusRipple
                disableRipple
                onClick={handleClose}
                sx={{
                  textAlign: "right",
                  width: "40px",
                  height: "40px",
                  display: { xs: "block", lg: "none" },
                }}
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "block", lg: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: '#212121',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}></Box>
        <SiderbarInfo />
      </Drawer>
      <SideBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
