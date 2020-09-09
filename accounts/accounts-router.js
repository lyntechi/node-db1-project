const express = require("express");
const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const accounts = await db.select("*").from("accounts");
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const accounts = await db
      .select("*")
      .from("accounts")
      .where("id", req.params.id)
      .limit(1);
    res.json(accounts[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const [id] = await db
      .insert({
        name: req.body.name,
        budget: req.body.budget,
      })
      .into(accounts);
  } catch (err) {
    next(err);
  }
});
router.put("/", async (req, res, next) => {
  await db("accounts")
    .update({ name: req.body.name, budget: req.body.budget })
    .where("id", req.params.id);
});

router.delete("/", async (req, res, next) => {
  await db("accounts").where("id", req.params.id).del();
});

module.exports = router;
