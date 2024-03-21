const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

let popsicle = { name: "popsicle", price: 1.45 };

beforeEach(function () {
  db.items.push(popsicle);
});

afterEach(function () {
  db.items = [];
});

/**GET /items returns { items: [{ name: "popsicle", price: 1.45 },]} */

describe("GET /items", function () {
  it("Gets a list of items", async function () {
    const resp = await request(app).get('/items');

    expect(resp.body).toEqual({ items: [popsicle] });
  });
});

/**GET /items/popsicle returns {name: "popsicle", "price": 1.45}*/

describe("GET /items/:name", function () {
  it("Gets info about an item", async function () {
    const resp = await request(app).get(`/items/${popsicle.name}`);

    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  });
});


/**GET /items/xyz returns error message*/
describe("GET /items/:name", function () {
  it("Gets info about an item", async function () {
    const resp = await request(app).get("/items/xyz");

    expect(resp.body).toEqual({
      "error": {
        "message": "Not Found",
        "status": 404
      }
    });
  });
});


/**DELETE /items/popsicle returns { message: "Deleted" }*/

describe("DELETE /items/:name", function () {
  it("Deltes an item", async function () {
    const resp = await request(app).delete(`/items/${popsicle.name}`);

    expect(resp.body).toEqual({ message: "Deleted" });
    expect(db.items.length).toEqual(0);
    // also test for delete something that doesn't exist(404)
  });
});


/**POST /items returns { 'added': {name: "ice cream", price: "8.50"} }*/

describe("POST /items", function () {
  it("Adds an item", async function () {
    const addedItem = {
      name: "ice cream",
      price: "8.50"
    };

    const resp = await request(app)
      .post(`/items`)
      .send(addedItem);
    expect(resp.body).toEqual({
      'added': addedItem
    });

    expect(db.items.length).toEqual(2);
    expect(resp.statusCode).toEqual(201);

  });
});

/**POST /items returns resp.statusCode 400 }*/

describe("POST /items", function () {
  // why does this result differ from insomnia if item only has one key?
  it("Throws error if item is undefined", async function () {
    const addedItem = undefined;

    const resp = await request(app)
      .post(`/items`)
      .send(addedItem);

    expect(resp.statusCode).toEqual(400);

  });
});


// patch
/**PATCH /items/:name returns { 'updatedItem': "updated popsicle", price: 11.45 } }*/

describe("PATCH /items/:name", function () {
  it("Modifies an item", async function () {
    const updatedItem = { name: "updated popsicle", price: 11.45 };
    const resp = await request(app)
      .patch(`/items/${popsicle.name}`)
      .send(updatedItem);

    expect(resp.body).toEqual({ 'updatedItem': updatedItem });
    expect(db.items.length).toEqual(1);
    // test for single key item
  });
});