import { Col, Avatar, Card, Text, Button, Row } from "@nextui-org/react";
import * as React from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { GetUserGuilds } from "../util/fetchapi/GetUserGuilds";
import { useSession, signIn, signOut } from "next-auth/react";

const username = "dsaaaaaaaaaaaaaaaaaaaaaaadsaaaaaaaaaaaaaaaaaaaaaaa";

const carddddd = (
  <Grid xs={2} sm={3} md={4} lg={4}>
    <Card
      isPressable
      isHoverable
      css={{
        h: "210px",
        position: "relative",
        "&::before": {
          content: "",
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "65%",
          background:
            "url(https://media.discordapp.net/attachments/991337796960784424/1092497274204078121/MHCAT_Discord.png?width=1557&height=876) no-repeat center",
          backgroundSize: "cover",
          backgroundColor: "#f2f2f2",
          zIndex: "-1",
        },
      }}
    >
      <Avatar
        css={{
          position: "absolute",
          top: "65%",
          left: "50px",
          transform: "translate(-50%, -50%)",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "100%",
          height: "65%",
          zIndex: "1",
          width: "80px",
          height: "80px",
        }}
        src="https://media.discordapp.net/attachments/991337796960784424/1076133775026700309/fotor_2023-2-17_21_31_7.png?width=160&height=160"
      />
      <Typography
        sx={{
          position: "absolute",
          top: "69%",
          left: "95px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "65%",
        }}
      >
        <span style={{ position: "relative" }}>{username.charAt(0)}</span>
        {username.slice(1)}
      </Typography>
    </Card>
  </Grid>
);

export default function Home() {
  const { data: session } = useSession();
  const getGuilds = GetUserGuilds(session.accessToken, session.id);

  console.log(session);
  console.log(getGuilds);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2.5} columns={{ xs: 2, sm: 6, md: 12, lg: 16 }}>
        {carddddd}
      </Grid>
    </Box>
  );
}
