# MHCAT-dashboard

MHCAT 的儀表板

使用
`npm install`

之後將template.env 改名為.env
下面講解各個用途

```
(你的機器人名稱)
NAME=
(Discord Id)
DISCORD_CLIENT_ID=
(在discord的開發者介面找的到)
DISCORD_CLIENT_SECRET=
(Discord的Token)
TOKEN=
(你的網站的URL)
NEXTAUTH_URL=
(Mongodb的連結URL)
MONGO_URI=
(JWT Key)
JWT_SECRET=
(Redis的URL)
REDIS_URL=
```

確認都輸入完成之後
接著輸入

`npm run build`

`npm run start`

就可以成功囉
