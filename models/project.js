var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  price: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    }
  ]
});

module.exports = mongoose.model("Project", projectSchema);
