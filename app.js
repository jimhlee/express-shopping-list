
const express = require("express");
const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError } = require("./expressError");
const app = express();

// const userRoutes = require("./userRoutes");
// const { logger, onlyAllowElie } = require("./middleware");

app.use(express.json());

router.get('/items', function (req, res) {
  return res.json(db.items.all());
});

router.post('/items', function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const item = {
    name: req.body.name,
    price: req.body.price
  };
  db.items.append(item);
  return res.status(201).json({ added: item });
});

router.get('/items/:name', function (req, res) {
  const itemName = req.params.name;

  for (item in db.items) {
    if (item.name === itemName) {
      return res.json({ item });
    }
  }
  throw new NotFoundError();
});

router.patch('/items/:name', function (req, res) {
  const updatedItem = {
    name: req.body.name,
    price: req.body.price
  };

  for (item in db.items) {
    if (item.name === req.params.name) {
      item = updatedItem;
      return res.json({ updatedItem });
    }
  }
  throw new NotFoundError();
});

router.delete('/items/:name', function (req, res) {
  const itemName = req.params.name;

  db.items = db.items.filter(item => item.name !== itemName);

  return res.json({ message: "Deleted" });
});


module.exports = router;