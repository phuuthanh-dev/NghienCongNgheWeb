const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
const generate = require('../helpers/generate')
mongoose.plugin(slug);

const userSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    banners: {
      type: Array,
      default: []
    },
    token: {
      type: String,
      default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    status: {
      type: String,
      default: "active"
    },
    friendsList: [
      {
        user_id: String,
        room_chat_id: String,
        unseenChats: {
          type: Number,
          default: 0
        }
      }
    ],
    acceptFriends: Array,
    requestFriends: Array,
    statusOnline: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    slug: {
      type: String,
      slug: "fullName",
      unique: true
    }
  },
{
  timestamps: true,
  }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;