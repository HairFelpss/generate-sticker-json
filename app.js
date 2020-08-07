require("dotenv/config");

const express = require("express");
const Packs = require("./models").packs;
const Stickers = require("./models").stickers;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const app = express();
app.use(express.json());
const port = 3333;

app.get("/stickers/:count", async (req, res) => {
  try {
    const { count } = req.params;
    const response = await Packs.findAndCountAll({
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

app.get("/stickers/search/:search", async (req, res) => {
  try {
    const { search } = req.params;
    const response = await Packs.findAndCountAll({
      where: {
        name: { [Op.like]: `%${search}%` },
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
      limit: 10,
    });
    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
});

app.listen(port, async () => {
  console.log(`Server is up at ${port}`);
});
