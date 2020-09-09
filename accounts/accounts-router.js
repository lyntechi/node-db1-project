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

// router.post("/", async (req, res, next) => {
//   try {
//     const [id] = await db
//       .insert({
//         name: req.body.name,
//         budget: req.body.budget,
//       })
//       .into("accounts")
//       next()
//   } catch (err) {
//     next(err);
//   }
// });

router.post("/", (req, res) => {
  const postData = req.body;
  db("accounts")
    .insert(postData, "id")
    .then((ids) => {
      const id = ids[0];
      db("accounts")
        .where({ id })
        .first()
        .then((newPost) => {
          res.status(201).json(newPost);
        })
        .catch((error) => {
          console.log(error.message);
          res.status(500).json(error.message);
        });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json(error.message);
    });
});

// router.put("/", async (req, res, next) => {
//   await db("accounts")
//     .update({ name: req.body.name, budget: req.body.budget })
//     .where("id", req.params.id);
// });

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.name || !changes.budget) {
    res.status(400).json({ messge: "we need a name and budget on that body" });
  } else {
    db("accounts")
      // .where("id", "=", req.params.id)
      .where({ id })
      .update(changes)
      .then((count) => {
        res.status(200).json({ message: `${count} accounts(s) updated` });
      })
      .catch((error) => {
        console.log(error.message);
        res.status(500).json(error.message);
      });
  }
});

router.delete("/:id", (req, res) => {
  knex("accounts")
    .where({ id: req.params.id })
    .del()
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: `${count} account(s) deleted` });
      } else {
        res.status(404).json({
          message: "There was no account with that id in our database",
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json(error.message);
    });
});

module.exports = router;
