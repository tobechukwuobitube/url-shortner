const express = require("express");
const config = require("config");
const Url = require("../url");

let getShortenUrlRoute = express.Router();

getShortenUrlRoute.get("/:shortUrl", async (req, res) => {
  let shortUrlCode = req.params.shortUrl;

  let url = await Url.findOne({ urlCode: shortUrlCode });

  try {
    if (url) {
      let clickCount = url.clickCount;
      if (clickCount >= config.allowedClick) {
        console.log(
          "The click count for shortcode " +
            shortUrlCode +
            " has passed the limit of " +
            config.allowedClick
        );
        return res
          .status(400)
          .json(
            "The ckick count for shortcode " +
              shortUrlCode +
              " has passed the limit of " +
              config.allowedClick
          );
      }
      clickCount++;
      await url.update({ clickCount });
      return res.redirect(url.longUrl);
    } else {
      return res
        .status(400)
        .json("The short url does not exist in our system.");
    }
  } catch (error) {
    console.error(
      "Error while retrieving long url for shorturlcode " + shortUrlCode
    );
    return res.status(500).json("There is some internal error");
  }
});

module.exports = getShortenUrlRoute;
