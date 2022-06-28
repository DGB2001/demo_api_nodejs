module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "file",
    {
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    },
    {
      paranoid: true,
    }
  );
  return File;
};
