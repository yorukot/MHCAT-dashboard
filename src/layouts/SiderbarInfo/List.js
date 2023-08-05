import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { IoMdAdd } from "react-icons/io";
import { BsFillCaretDownFill } from "react-icons/bs";
import { useRouter } from "next/router";
import Link from "next/link";
import { styled, ThemeProvider, createTheme } from "@mui/material/styles";
import MuiLink from "@mui/material/Link";
import { BsFillDoorOpenFill } from "react-icons/bs";
import {MdWork} from 'react-icons/md'
import { AiFillWarning } from 'react-icons/ai';
import {MdKeyboardVoice} from 'react-icons/md'
const FireNav = styled(List)({
  "& 	.MuiLink-root": {
    textDecoration: "none",
  },
  "& .MuiDivider-root": {
    marginTop: "5px",
    marginBottom: "5px",
  },
  "& .MuiListItemButton-root": {
    borderRadius: 10,
    marginRight: "10px",
    marginLeft: "10px",
    color: '#c7c7c7'
  },
  "& .MuiListItemIcon-root": {
    border: "2px solid #595959",
    borderRadius: 10,
    padding: 7,
    minWidth: 0,
    marginRight: "10px",
    marginLeft: "10px",
    fontSize: 15,
  },
  "& .MuiListItemIcon-root:hover": {
    border: "2px solid #595959",
    borderRadius: 10,
  },
  "& .MuiListItemButton-root:hover": {
    borderRadius: 10,
    marginRight: "10px",
    fontSize: 1,
    marginLeft: "10px",
  },
  "& .MuiListItemButton-root:focus": {
    borderRadius: 10,
    marginRight: "10px",
    fontSize: 1,
    marginLeft: "10px",
  },
});

export default function SiderBarList() {
  const router = useRouter();
  const isActive = (href) => router.pathname === href;
  return (
    <>
      <FireNav component="nav" disablePadding>
        <Link href="/">
          <MuiLink>
            <ListItemButton sx={{ marginTop: "5px",backgroundColor: isActive(`/`) ? '#363636' : 'transparent' }}>
              <ListItemIcon>
                <BsFillCaretDownFill />
              </ListItemIcon>
              <ListItemText primary="請選擇一個伺服器" />
            </ListItemButton>
          </MuiLink>
        </Link>
        <Divider />
        {router.query.id ? (
          <>
            <Link href={`/guilds/${router.query.id}/welcome`}>
              <MuiLink>
                <ListItemButton sx={{backgroundColor: isActive(`/guilds/[id]/welcome`) ? '#363636' : 'transparent'}}>
                  <ListItemIcon>
                    <BsFillDoorOpenFill />
                  </ListItemIcon>
                  <ListItemText primary="歡迎系統" />
                </ListItemButton>
              </MuiLink>
            </Link>
            <Link href={`/guilds/${router.query.id}/work`}>
              <MuiLink>
                <ListItemButton sx={{backgroundColor: isActive(`/guilds/[id]/wrok`) ? '#363636' : 'transparent'}}>
                <ListItemIcon>
                    <MdWork />
                  </ListItemIcon>
                  <ListItemText primary="打工系統" />
                </ListItemButton>
              </MuiLink>
            </Link>
            <Link href={`/guilds/${router.query.id}/voice`}>
              <MuiLink>
                <ListItemButton sx={{backgroundColor: isActive(`/guilds/[id]/voice`) ? '#363636' : 'transparent'}}>
                <ListItemIcon>
                    <MdKeyboardVoice />
                  </ListItemIcon>
                  <ListItemText primary="語音系統" />
                </ListItemButton>
              </MuiLink>
            </Link>
            <Link href={`/guilds/${router.query.id}/warn`}>
              <MuiLink>
                <ListItemButton sx={{backgroundColor: isActive(`/guilds/[id]/warn`) ? '#363636' : 'transparent'}}>
                <ListItemIcon>
                    <AiFillWarning />
                  </ListItemIcon>
                  <ListItemText primary="警告系統" />
                </ListItemButton>
              </MuiLink>
            </Link>
            <Divider />
          </>
        ) : (
          <></>
        )}
        <Link href={`https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=applications.commands%20bot`}target="_blank">
              <MuiLink>
        <ListItemButton>
          <ListItemIcon>
            <IoMdAdd />
          </ListItemIcon>
          <ListItemText primary="邀請機器人" />
        </ListItemButton>
        </MuiLink>
        </Link>
      </FireNav>
    </>
  );
}
