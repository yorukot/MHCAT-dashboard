import { Col, Avatar, Card, Text, Button, Row } from "@nextui-org/react";
import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { GetUserGuilds } from "../util/fetchapi/GetUserGuilds";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "@nextui-org/react";
import { getSession } from "next-auth/react";

function getRandomColor() {
  const colors = ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FF1493', '#DB7093', '#C71585', '#B0E0E6', '#ADD8E6', '#87CEFA', '#87CEEB', '#00BFFF', '#1E90FF', '#6495ED', '#7B68EE', '#4169E1', '#0000FF', '#000080'];
  return colors[Math.floor(Math.random() * colors.length)];
}
function getRandomGradient() {
  const angle = Math.floor(Math.random() * 361);
  const color1 = getRandomColor();
  const color2 = getRandomColor();
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}
export default function Home(Guildsdata) {
  const router = useRouter();
  const guilds = Guildsdata.guilds
  return (
    <Box sx={{ flexGrow: 1 }}>
      {guilds.length > 0 ? (
        <Grid
          container
          spacing={2.5}
          columns={{ xs: 2, sm: 6, md: 12, lg: 16 }}
        >
          {guilds.map((guild) => (
            <Grid
              key={guild.id}
              onClick={() => router.push(`/guilds/${guild.id}`)}
              xs={2}
              sm={3}
              md={4}
              lg={4}
            >
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
                    background: `${guild.icon ? `url(https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png) no-repeat center`
                    : `url(https://media.discordapp.net/attachments/991337796960784424/1092497274204078121/MHCAT_Discord.png?width=1557&height=876) no-repeat center`}`,
                    backgroundSize: "cover",
                    zIndex: "-1",
                  },
                }}
              >
                <Avatar
                  text={guild.name}
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
                    backgroundColor: "#303338",
                  }}
                  src={
                    guild.icon
                      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                      : null
                  }
                ></Avatar>
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
                  <span style={{ position: "relative" }}>
                    {guild.name.charAt(0)}
                  </span>
                  {guild.name.slice(1)}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh" }}
        >
          <Loading size="xl" />
        </Grid>
      )}
    </Box>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session)
    return {
      props: {
        status: "401",
      },
    };
  const guildsData = await GetUserGuilds(session.id);
  return {
    props: {
      status: "200",
      guilds: guildsData
    }
  }
}