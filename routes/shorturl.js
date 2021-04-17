const express = require("express");
const shortid = require("shortid");
const validUrl = require("valid-url");
const config = require("config");
const Url = require("../url");

let shortUrlRoute = express.Router();

shortUrlRoute.post("/", async (req, res) => {
  const longUrl = req.body.longUrl;
  const baseUrl = config.get("baseURL");

  if (!validUrl.isUri(baseUrl)) {
    return res.status(401).json("Internal error. Please come back later.");
  }

  const urlCode = shortid.generate();

  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl: longUrl });

      if (url) {
        return res.status(200).json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;
        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          clickCount: 0,
        });

        await url.save();
        return res.status(200).json(url);
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Internal Server Error: " + error.message);
    }
  } else {
    res
      .status(400)
      .json("Invalid URL. Please enter a valid url for shortening.");
  }
});

module.exports = shortUrlRoute;
