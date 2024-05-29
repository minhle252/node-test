const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const session = require('express-session');
const app = express();
const query = require("express/lib/middleware/query");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// const redis = require("redis");
// const redisStore = require('connect-redis')(session);
// const bodyParser = require("body-parser");
const route = require("./routes/index");
// const client  = redis.createClient();
const urlConfig = require("./config/constant");
const helpers = require("./app/utils/helpers");
require("dotenv").config();
// app.use(upload.array()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
const PORT = process.env.PORT || 5000;

app.use(cookieParser());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// express session
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  // store: new redisStore({ host: 'localhost', port: 6380, client: client,ttl :  260}),
  secret: 'keyboard cat', 
  cookie: { secure: false,maxAge: 60000*60*24 }
}));

// 
app.use(express.static(path.join(__dirname, "resources/asset")));
app.use("/uploads", express.static("uploads"));



// template engine
const hbs = exphbs.create({
  extname: ".hbs",
  helpers
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources/views"));

//
const corsConfig = {
  origin: true,
  credentials: true,
};
app.use(cors(corsConfig));

route(app);

app.listen(PORT, () => {
  console.log(`App listening at  ${urlConfig}`);
});
