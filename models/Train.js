const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    row: {
      type: Number,
      trim: true,
    },
    column: {
      type: Number,
      trim: true,
    },  
    seat : [{
        no: Number,
        booked:Boolean,
        age: Number,
        gender: String
    }]
  }
);

module.exports = mongoose.model('Train', TrainSchema);
