const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10kb",
  })
);

// user

app.all('*', (req, res, next)=>{
next(new AppError(`Can't find ${req.originalUrl} on this servver!`, 404))
})

module.exports= app