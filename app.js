require("dotenv/config");

const express = require("express");
const Packs = require("./models").packs;
const Stickers = require("./models").stickers;

const app = express();
app.use(express.json());
const port = 3333;

app.get("/", async (req, res) => {
  try {
    const response = await Packs.findAndCountAll({
      attributes: [
        "id_pack",
        ["id_pack", "identifier"],
        "name",
        "publisher",
        ["url_base", "referencia"],
      ],
      include: [
        {
          model: Stickers,
          as: "sticker",
          limit: 10,
          offset: 0,
          attributes: ["image_name"],
        },
      ],
    });
    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
});

app.listen(port, async () => {
  console.log(`Server is up at ${port}`);
});
