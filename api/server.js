"use strict";

const express = require("express");
const line = require("@line/bot-sdk");
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: "b43963d89a469928438abd7c8af13353",
  channelAccessToken:
    "GkxxGy3KK+U9Gk97iV9lEJBoLLAyj+qzCM44hTkuuqQ+MhY0QDBi+ezQM6g04B5RIUkcZyfoNOM02kAcmfIMYm87QatQcoZ5qJTmgNoRzNy/paX4734CT37g77r1Cp2k1DWuYFitT68Sk8BvdMa0+wdB04t89/1O/w1cDnyilFU=",
};

const app = express();

app.get("/", (req, res) => res.send("Hello LINE BOT!(GET)")); //ブラウザ確認用(無くても問題ない)
app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: "text",
    text: event.message.text, //実際に返信の言葉を入れる箇所
  });
}

process.env.NOW_REGION ? (module.exports = app) : app.listen(PORT);
console.log(`Server running at ${PORT}`);
