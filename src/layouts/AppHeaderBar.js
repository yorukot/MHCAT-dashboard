import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import SideBar from "./sideBar";
import Button from "@mui/material/Button";
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
import LightModeIcon from '@mui/icons-material/LightMode';

const drawerWidth = 270;

export default function AppHeaderBar({ children }) {
  const { data: session, status } = useSession();
  const [open, setSnackBarState] = useState(false);
  const handleClose = () => {
    setSnackBarState(open ? false : true);
  };
  if (status === "authenticated") {
    return (
      <Box sx={{ display: "flex", marginTop: "64px" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ display: "flex" }}>
            <Link href="/" underline="none">
              <Avatar
                href="/"
                src="https://media.discordapp.net/attachments/991337796960784424/1076133775026700309/fotor_2023-2-17_21_31_7.png?width=160&height=160"
              ></Avatar>
            </Link>

            <Typography
              href="/"
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, paddingLeft: "10px" }}
            >
              MHCAT
            </Typography>

            <Stack direction="row" spacing={1}>
              <Box  sx={{border: '3px solid', borderRadius:'10px'}} >
              <IconButton aria-label="delete">
                <LightModeIcon />
              </IconButton>
              </Box>

              <Box>
              <IconButton
                onClick={handleClose}
                sx={{
                  textAlign: "right",
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
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
                  <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Divider />
        </Box>

          <SiderbarInfo />
        </Drawer>
        <SideBar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { lg: `calc(100% - ${drawerWidth}px)`,xs: "100%" },
          }}
        >
          {children}
        </Box>
      </Box>
    );
  }else{
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="span"
          sx={{
            p: 2,
            border: "1px solid grey",
            backgroundColor: "#2b2b2b",
            borderRadius: "20px",
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => signIn("discord")}
            sx={{
              backgroundColor: "#5765f2",
              "&:hover": { backgroundColor: "#3a43a1" },
            }}
            startIcon={<BsDiscord />}
          >
            使用Discord登入
          </Button>
        </Box>
      </div>
    );
  }
}
