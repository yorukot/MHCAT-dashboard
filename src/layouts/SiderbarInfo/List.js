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

export default function SiderBarList() {
  const router = useRouter();
  return (
    <>
      <List>
        <Link href="/">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BsFillCaretDownFill />
              </ListItemIcon>
              <ListItemText primary="請選擇一個伺服器" />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Divider />
      {router.query.id ? (
        <>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BsFillCaretDownFill />
                </ListItemIcon>
                <ListItemText primary="請選擇一個伺服器" />
              </ListItemButton>
            </ListItem>
          </List>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <BsFillCaretDownFill />
                </ListItemIcon>
                <ListItemText primary="請選擇一個伺服器" />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </>
      ) : (
        <></>
      )}
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <IoMdAdd />
            </ListItemIcon>
            <ListItemText primary="邀請機器人" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );
}
