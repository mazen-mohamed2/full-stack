const mongoose = require("mongoose");

const fristSchema = new mongoose.Schema({
    name: {
      type:String,
      require: [true, "this fields should add"],
      unique:true,
      trim:true

    },
    duration: {
      type: Number,
      require: [true, 'fall this filed']
    },
    maxGroupSize:{
      type: Number,
      require: [true, 'fall this filed']
    },
    difficulty:{
      type: String,
      require: [true,"fall this filed"]
    },
    ratingAverage: {
      type:Number,
      default :5
    },
    ratingQuantity: {
      type:Number,
      default :0
    },
    price: {
      type:Number,
      required:[true,"price is needed"],
    },
    priceDiscount: Number,
    summery:{
      type:String,
      trim:true,
      require: [true,"fall this filed"]
    },
    description:{
      type:String,
      trim: true,
    },
    imageCover: { 
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],

    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDate: [Date]

  })
  
  const Tour = mongoose.model("Tour", fristSchema)
module.exports = Tour