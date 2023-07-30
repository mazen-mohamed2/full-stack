
// console.log(mongoose);
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const DB = process.env.DATABASE_URL
mongoose.connect(DB,{
  useNewUrlParser:true,
}).then((()=>console.log("db in succsess")))

const app = require("./app");





app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
