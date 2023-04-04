import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Divider from "@mui/material/Divider";
import List from '@mui/material/List';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function SiderBarList() {
  return (
    <>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ArrowDropDownIcon />
            </ListItemIcon>
            <ListItemText primary='請選擇一個伺服器' />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </>
  );
}
