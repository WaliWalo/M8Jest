const router = require("express").Router();
const UserSchema = require("./schema");
const UserModel = require("mongoose").model("User", UserSchema);
const axios = require("axios");
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error("Provide credentials");

    const user = new UserModel({ username, password });
    const { _id } = await user.save();

    res.status(201).send({ _id });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      errorCode: "wrong_credentials",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) throw new Error("Provide credentials");

    const user = await UserModel.findOne({ username });

    user.password === password
      ? res
          .status(200)
          .cookie("token", "VALID_TOKEN")
          .send({ token: "VALID_TOKEN" })
      : res.status(400).send({ message: "No username/password match" });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      errorCode: "wrong_credentials",
    });
  }
});

router.get("/cats", async (req, res, next) => {
  try {
    console.log("TEST");
    let response = await axios.get(`https://cataas.com/cat?json=true`);
    if (response.status === 200) {
      res.status(201).send(response.data);
    } else {
      let error = response.statusText;
      console.log(error);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
      errorCode: "NOT FOUND",
    });
  }
});

module.exports = router;
