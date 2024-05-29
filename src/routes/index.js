const userRouter = require("./api/api.user");
// const
const route = (app) => {
  app.use("/api/user/", userRouter);

};

module.exports = route;
