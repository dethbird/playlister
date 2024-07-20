const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}`);

const User = sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        spotify_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: 'user',
        underscored: true
    },
);

const Playlist = sequelize.define(
    'playlist',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spotify_playlist_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        active: {
            type: DataTypes.ENUM('Y', 'N'),
            allowNull: false,
            defaultValue: 'Y'
        }
    },
    {
        tableName: 'playlist',
        underscored: true
    },
);

const Favorite = sequelize.define(
    'favorite',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        spotify_playlist_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: 'favorite',
        underscored: true
    },
);

module.exports = {
    User, Playlist, Favorite
};

// const newUser = User.create({spotify_user_id: 555});

// const newPlaylist = Playlist.create({user_id: 555, spotify_playlist_id: "LDSJFLKDSBFLKSDBF"});
// const newFavorite = Favorite.create({user_id: 555, spotify_playlist_id: "LDSJFLKDSBFLKSDBF"});

// console.log(newUser);
// console.log(newPlaylist);

