module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Gallery);
      },
    },
  });

  return User;
};
