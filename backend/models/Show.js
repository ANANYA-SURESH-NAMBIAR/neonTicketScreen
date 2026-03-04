 
const mongoose = require("mongoose");
const Screen = require("./Screen");
const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
  screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
  date: Date,
  time: String,
  price: Number,
  available_seats: Number,
});

showSchema.pre("save", async function(){
  if(this.available_seats == null){
    const screen = await Screen.findById(this.screen);
    this.available_seats = screen?.totalSeats || 0;
  }
});

module.exports = mongoose.model("Show", showSchema);
