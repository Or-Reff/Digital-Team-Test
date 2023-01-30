// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const enumState = require("./enums/state.ts");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

const stateModel = require("./models/stateModel");
const { default: mongoose } = require("mongoose");

const port = process.env.PORT || 3000;

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://orMongoAdmin:sGkkSwZgVXMMe3nq@cluster0.aftzbrv.mongodb.net/DigitalTeamTest"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin,X-Requested-With, Content-Type, Accept"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   );
//   next();
// });

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.post("/api/defaultBoxes",)

//Update Box State
app.get("/api/state", async (req, res, next) => {
  const id = req.query.id; // $_GET["id"]
  let rand = Math.floor(Math.random() * Object.keys(enumState).length);
  let randStateValue = enumState[Object.keys(enumState)[rand]];
  const state = await stateModel.findOneAndUpdate(
    { id },
    { state: randStateValue },
    {
      upsert: true,
      multi: false,
    }
  );
  res.send(state);
});

// Route to get all the data from the database
app.get("/api/alldata", async (req, res) => {
  try {
    const data = await stateModel.find();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Route to get all the data from the database
app.get("/api/alldata", async (req, res) => {
  try {
    const data = await stateModel.updateMany();
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  app.get("/api/data", async (req, res) => {
    const data = await stateModel.find();
    console.log(data[0].state);

    // const keys = Object.keys(enumState);
    // const bulkOps = data.map((item) => ({
    //   updateOne: {
    //     filter: { id: item.id },
    //     update: { $set: { state: keys[Math.floor(Math.random() * keys.length)] } }
    //   }
    // }));

    // await stateModel.bulkWrite(bulkOps);

    //TODO update the mongoDB like previous method

    data.forEach((item, index) => {
      console.log(
        `enumstate: ${enumState[data[index].state] || enumState.ERROR}`
      );
      data[index].state = data[index].state || enumState.ERROR;
    });

    // Emiting data real-time
    io.emit("data", data);
    // Return data to the client
    res.json(data);
  });
});
http.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;
