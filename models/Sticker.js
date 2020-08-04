module.exports = (sequelize, DataTypes) => {
  const sticker = sequelize.define(
    "stickers",
    {
      id_pack: DataTypes.STRING,
      image_name: DataTypes.STRING,
      created_on: DataTypes.DATE,
    },
    {
      timestamps: true,
      updatedAt: false,
      createdAt: false,
    }
  );

  return sticker;
};
