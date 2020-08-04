module.exports = (sequelize, DataTypes) => {
  const pack = sequelize.define(
    "packs",
    {
      id_pack: DataTypes.STRING,
      name: DataTypes.STRING,
      publisher: DataTypes.STRING,
      url_base: DataTypes.STRING,
      url_zip: DataTypes.STRING,
      lang: DataTypes.STRING,
      created_on: DataTypes.DATE,
    },
    {
      timestamps: true,
      updatedAt: false,
      createdAt: false,
    }
  );

  pack.associate = (models) => {
    pack.hasMany(models.stickers, {
      foreignKey: "id_pack",
      sourceKey: "id_pack",
      as: "sticker",
    });
  };
  return pack;
};
