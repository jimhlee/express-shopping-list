
const express = require("express");
const db = require("./fakeDb");
const router = new express.Router();

const { NotFoundError } = require("./expressError");
const { BadRequestError } = require("./expressError");
//const app = express();

// const userRoutes = require("./userRoutes");
// const { logger, onlyAllowElie } = require("./middleware");

//app.use(express.json());


router.get('/', function (req, res) {
const items = db.items;
  return res.json({ items });
});

router.post('/', function (req, res) {
  if (req.body === undefined) throw new BadRequestError();
  const item = {
    name: req.body.name,
    price: req.body.price
  };
  const items = db.items;
  items.push(item);
  return res.status(201).json({ added: item });
});

router.get('/:name', function (req, res) {
  const itemName = req.params.name;
  for (item of db.items) {
    if (item.name === itemName) {
      console.log(item);
      return res.json(item);
    }
  }
  throw new NotFoundError();
});

router.patch('/:name', function (req, res) {
  const updatedItem = {
    name: req.body.name,
    price: req.body.price
  };

  for (item of db.items) {
    if (item.name === req.params.name) {
      item = updatedItem;
      return res.json({ updatedItem });
    }
  }
  throw new NotFoundError();
});

router.delete('/:name', function (req, res) {
  const itemName = req.params.name;

  db.items = db.items.filter(item => item.name !== itemName);

  return res.json({ message: "Deleted" });
});


module.exports = router;