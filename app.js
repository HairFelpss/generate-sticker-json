require("dotenv/config");

const express = require("express");
const Packs = require("./models").packs;
const Stickers = require("./models").stickers;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const app = express();
const port = 3333;

app.use(express.json());

app.get("/list/:count/:lang", async (req, res) => {
  try {
    const { count, lang } = req.params;

    const response = await Packs.findAndCountAll({
      where: {
        lang: { [Op.like]: `%${lang}%` },
      },
      attributes: [
        "id_pack",
        ["id_pack", "identifier"],
        "name",
        "url_zip",
        "publisher",
        ["url_base", "referencia"],
      ],
      include: [
        {
          model: Stickers,
          as: "sticker",
          attributes: ["image_name"],
        },
      ],
      offset: count,
      limit: 10,
    });
    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
});

app.get("/search/:search/:count/:lang", async (req, res) => {
  try {
    const { search, count, lang } = req.params;
    const response = await Packs.findAndCountAll({
      where: {
        [Op.and]: [
          { name: { [Op.like]: `%${search}%` } },
          { lang: { [Op.like]: `%${lang}%` } },
        ],
      },
      attributes: [
        "id_pack",
        ["id_pack", "identifier"],
        "name",
        "url_zip",
        "publisher",
        ["url_base", "referencia"],
      ],
      include: [
        {
          model: Stickers,
          as: "sticker",
          attributes: ["image_name"],
        },
      ],
      limit: 20,
      offset: count,
    });

    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
});

app.get("/packList/:count/:lang", async (req, res) => {
  try {
    const { count, lang } = req.params;

    const response = await Packs.findAndCountAll({
      where: {
        lang: { [Op.like]: `%${lang}%` },
      },
      attributes: ["id_pack", "name", "url_zip", "publisher", "url_base"],
      include: [
        {
          model: Stickers,
          as: "sticker",
          attributes: ["image_name"],
          separate: true,
          limit: 5,
        },
      ],
      offset: count,
      limit: 10,
    });

    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
});

app.get("/savePack/:pack", async (req, res) => {
  try {
    const { pack } = req.params;

    const response = await Stickers.findAll({
      where: {
        id_pack: { [Op.like]: `%${pack}%` },
      },
      attributes: ["image_name"],
    });

    const webp = response.map((image) => ({
      image_file: image.image_name.replace(".png", ".webp"),
    }));

    res.json(webp);
  } catch (err) {
    res.json(err);
  }
});

app.get("/showPack/:pack", async (req, res) => {
  try {
    const { pack } = req.params;

    const response = await Stickers.findAll({
      where: {
        id_pack: { [Op.like]: `%${pack}%` },
      },
      attributes: ["image_name"],
    });

    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

app.listen(port, async () => {
  console.log(`Server is up at ${port}`);
});
