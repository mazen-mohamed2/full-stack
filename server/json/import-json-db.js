const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../models/tourModels");
const DB = process.env.DATABASE_URL;

mongoose.connect(DB, {
  useNewUrlParser: true,
}).then(() => console.log("db in success"));

const toursData = JSON.parse(fs.readFileSync(`${__dirname}/data.json`, "utf-8"));

const dataConnect = async () => {
  try {
    await Tour.create(toursData);
    console.log("Data imported successfully!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const dataDelete = async () => {
  try {
    await Tour.deleteMany();
    console.log("All data deleted successfully!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv.includes("--import")) {
  dataConnect();
} else if (process.argv.includes("--delete")) {
  dataDelete();
}
