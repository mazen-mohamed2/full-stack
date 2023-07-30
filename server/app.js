const express = require("express");
const cors = require("cors"); // Import the cors middleware
const morgan = require("morgan");
const userRouter = require("./routes/usersRouter");
const dataRouter = require("./routes/dataRourte");

// const bodyParser = require("body-parser");

const app = express();
// const path = require("path");
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  
}
// app.set("view engine", "ejs");
// app.set("views", path.join(`${__dirname}/views`));
// app.use(bodyParser.urlencoded({ extended: true }));
// console.log("dd");
const corsOptions = {
  origin: 'http://localhost:3001', // Replace with the URL of the frontend in the different country
  credentials: true, // Enable credentials (cookies) for CORS
};
app.use(express.json());
app.use(cors(corsOptions));
 
app.use("/api/v1/users", userRouter);
app.use("/api/v1/data", dataRouter);


// app.use((req, res, next) => {
//   res.status(404).sendFile('404.html', { root: 'views' });
  
// });
module.exports = app;
