const stateModel = require("../models/stateModel");
exports.getData = async(req, res, next) => {
    try {
      const data = await stateModel.find();
      console.log(data[0].state);

      data.forEach((item, index) => {
        console.log(
          `enumstate: ${enumState[data[index].state] || enumState.ERROR}`
        );
        data[index].state = data[index].state || enumState.ERROR;
      });

      // Return data to the client
      res.json(data);
    } catch (ERROR) {
      res.sendStatus(400).json({ message: "cannot fetch data" });
    }
}
