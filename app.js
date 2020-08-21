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

    const packs = response.rows.map((pack) => ({
      name: pack.name,
      intro_images: [
        pack.url_base + pack.sticker[0].image_name,
        pack.url_base + pack.sticker[1].image_name,
        pack.url_base + pack.sticker[2].image_name,
        pack.url_base + pack.sticker[3].image_name,
        pack.url_base + pack.sticker[4].image_name,
      ],
      publisher: pack.publisher,
      id: pack.id_pack,
      zip_url: pack.url_zip,
    }));

    res.json(packs);
  } catch (err) {
    res.json(err);
  }
});

app.listen(port, async () => {
  console.log(`Server is up at ${port}`);
});
