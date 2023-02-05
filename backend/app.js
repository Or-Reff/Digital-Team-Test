// imports
const { debug } = require("console");
const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const server = http.createServer(app);
const enumState = require("./enums/state.ts");
const cron = require("node-cron");
const { Server } = require("socket.io");

const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");

const statesRoute = require("./routes/states");
// const { Socket } = require("socket.io");

const enumStateHard = ["KWS_KERIDOS", "KWS_KERIDOS_YG", "UNKNOWN", "ERROR"];

mongoose.set("strictQuery", false);
mongoose //mongoDB Atlas
  .connect(
    //should be hidden in ideal situation
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

/**Cron schedule every 0.5 seconds to update the Database with new stateModel*/
cron.schedule("*/" + "0,5 * * * * *", async function () {
  const docs = await stateModel.find();

  const promises = docs.map(async ({ _id, state }) => {
    const newState =
      enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    const data = stateModel.updateOne(
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

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const port = process.env.PORT || 3000;
const onListening = () => {
  console.log("listening on port:", port);
};
server.on("listening", onListening);
server.listen(port);

/**Cron schedule every 0.5 seconds to update the Database*/
cron.schedule("*/" + "0,5 * * * * *", async function () {
  const docs = await stateModel.find();
  const arrOfDocs = [];

  const promises = docs.map(async ({ _id, state }) => {
    const newState =
    enumStateHard[Math.floor(Math.random() * enumStateHard.length)];
    arrOfDocs.push({_id:_id, state:newState , isUpdated: newState != state })
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
  io.emit("fetchData", arrOfDocs);
});


module.exports = app;
