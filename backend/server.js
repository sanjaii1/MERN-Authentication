const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({
  path: "./config.env",
});
const app=require('./app')

const db = process.env.DB;
//database

mongoose
  .connect(db)
  .then(() => {
    console.log("DB connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

  const port =process.env.PORT || 3000

  app.listen(port,()=>{
    console.log(`App running on port ${port}`)
  })
