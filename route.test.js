const request = require("supertest");

const app = require("./app");
let db = require("./fakeDb");

let popsicle = { name: "popsicle", price: 1.45};

beforeEach(function() {
  db.items.push(popsicle);
});

afterEach(function() {
  db.items = [];
});

/**GET /items returns { items: [{ name: "popsicle", price: 1.45 },]} */

describe("GET /items", function() {
  it("Gets a list of items", async function() {
    const resp = await request(app).get('/items');

    expect(resp.body).toEqual({items: [popsicle]});
  });
});

/**GET /items/popsicle returns {name: "popsicle", "price": 1.45}*/

describe("GET /items/:name", function() {
  it("Gets info about an item", async function() {
    const resp = await request(app).get(`/items/${popsicle.name}`);

    expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
  })
})


/**GET /items/xyz returns error message*/
describe("GET /items/:name", function() {
  it("Gets info about an item", async function() {
    const resp = await request(app).get("/items/xyz");

    expect(resp.body).toEqual({
      "error": {
        "message": "Not Found",
        "status": 404
      }
    });
  })
})
