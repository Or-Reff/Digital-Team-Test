// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");
const cron = require("node-cron");


const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");

const app = express();
const statesRoute = require("./routes/states");

const enumStateHard = ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"];

mongoose.set("strictQuery", false);
mongoose //mongoDB Atlas
  .connect( //should be hidden in ideal situation
    "mongodb+srv://orMongoAdmin:sGkkSwZgVXMMe3nq@cluster0.aftzbrv.mongodb.net/DigitalTeamTest"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/**Cron schedule every 0.5 seconds to update the Database*/
cron.schedule("*/" + "0,5 * * * * *", async function () {
  const docs = await stateModel.find();

  const promises = docs.map(async ({ _id, state }) => {
    const newState =
      enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    return stateModel.updateOne(
      { _id },
      {
        $set: {
          state: newState,
          isUpdated: newState != state,
        },
      },
      {
        upsert: true,
        multi: false,
        strict: false,
      }
    );
  });

  Promise.all([promises]);
});

app.use("/api", statesRoute);

module.exports = app;
