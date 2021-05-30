const express = require("express");
const router = express.Router();

const charactersController = require("../controllers/charactersController");
const comicsController = require("../controllers/comicsController");
const seriesController = require("../controllers/seriesController");

router.get("/characters/page/:page", charactersController.index);

router.get("/characters/:id", charactersController.show);

router.get("/comics/page/:page", comicsController.index);

router.get("/comics/:id", comicsController.show);

router.get("/series/page/:page", seriesController.index);

router.get("/series/:id", seriesController.show);

router.get("*", async (req, res) => {
  res.status(404).json({ error: "Page not found!" });
});

module.exports = router;