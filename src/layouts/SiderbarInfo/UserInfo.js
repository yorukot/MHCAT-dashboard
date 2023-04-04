import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Avatar from "@mui/material/Avatar";
import { Popover, Button, Card, Grid, Text, Link } from "@nextui-org/react";
import {GoSignOut } from 'react-icons/go'
import { useSession, signIn, signOut } from "next-auth/react"

export default function UserInfo() {
  const { data: session} = useSession()
  return (
    <Box
      id="test"
      sx={{
         position: "fixed",
        bottom: 0,
        marginLeft: "16px",
        marginTop: "16px",
        marginBottom: "16px",
      }}
    >

      <Box sx={{ marginTop: "16px" }}>
        <Popover isBordered disableShadow>


          <Popover.Trigger>
            <Card isHoverable css={{ p: "$6", w: "240px" }}>
              <Card.Header>
                <Avatar src={session.user?.image}>
                {session.user.name}
                </Avatar>
                <Grid.Container css={{ pl: "$6" }}>
                  <Grid xs={12}>
                    <Text h4 css={{ lineHeight: "$xs" }}>
                      {session.user.name}
                    </Text>
                  </Grid>
                  <Grid xs={12}>
                    <Text css={{ color: "$accents8" }}>#{session.discriminator}</Text>
                  </Grid>
                </Grid.Container>
              </Card.Header>
            </Card>
          </Popover.Trigger>

          <Popover.Content>
          <Button color="error" flat auto icon={<GoSignOut />} onClick={() => signOut()}>
            登出
          </Button>
          </Popover.Content>
        </Popover>
      </Box>
    </Box>
  );
}
