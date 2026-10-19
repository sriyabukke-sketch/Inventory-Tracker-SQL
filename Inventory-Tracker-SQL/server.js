
const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const app = express();
const db = new Database(path.join(__dirname, "inventory.db"));

app.use(express.json());
app.use(express.static(__dirname));

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    quantity INTEGER NOT NULL CHECK(quantity >= 0),
    min_stock INTEGER NOT NULL DEFAULT 5
  )
`);

app.get("/api/products", (req, res) => {
  const search = `%${req.query.search || ""}%`;

  const products = db.prepare(`
    SELECT * FROM products
    WHERE name LIKE ? OR sku LIKE ? OR category LIKE ?
    ORDER BY id DESC
  `).all(search, search, search);

  res.json(products);
});

app.get("/api/stats", (req, res) => {
  res.json(db.prepare(`
    SELECT
      COUNT(*) AS totalProducts,
      COALESCE(SUM(quantity), 0) AS totalUnits,
      COALESCE(SUM(price * quantity), 0) AS stockValue,
      COALESCE(SUM(
        CASE WHEN quantity <= min_stock THEN 1 ELSE 0 END
      ), 0) AS lowStock
    FROM products
  `).get());
});

app.post("/api/products", (req, res) => {
  const { name, sku, category, price, quantity, min_stock = 5 } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof sku !== "string" || !sku.trim() ||
    typeof category !== "string" || !category.trim() ||
    !Number.isFinite(Number(price)) || Number(price) < 0 ||
    !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
    !Number.isInteger(Number(min_stock)) || Number(min_stock) < 0
  ) {
    return res.status(400).json({ error: "Enter valid product details." });
  }

  try {
    const result = db.prepare(`
      INSERT INTO products (name, sku, category, price, quantity, min_stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(), sku.trim(), category.trim(),
      Number(price), Number(quantity), Number(min_stock)
    );

    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "This SKU already exists." });
    }
    res.status(500).json({ error: "Could not save product." });
  }
});

app.put("/api/products/:id", (req, res) => {
  const { name, sku, category, price, quantity, min_stock = 5 } = req.body;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof sku !== "string" || !sku.trim() ||
    typeof category !== "string" || !category.trim() ||
    !Number.isFinite(Number(price)) || Number(price) < 0 ||
    !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
    !Number.isInteger(Number(min_stock)) || Number(min_stock) < 0
  ) {
    return res.status(400).json({ error: "Enter valid product details." });
  }

  try {
    const result = db.prepare(`
      UPDATE products
      SET name = ?, sku = ?, category = ?, price = ?,
          quantity = ?, min_stock = ?
      WHERE id = ?
    `).run(
      name.trim(), sku.trim(), category.trim(),
      Number(price), Number(quantity), Number(min_stock),
      req.params.id
    );

    if (!result.changes) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.json({ message: "Product updated." });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ error: "This SKU already exists." });
    }
    res.status(500).json({ error: "Could not update product." });
  }
});

app.delete("/api/products/:id", (req, res) => {
  const result = db.prepare(
    "DELETE FROM products WHERE id = ?"
  ).run(req.params.id);

  if (!result.changes) {
    return res.status(404).json({ error: "Product not found." });
  }

  res.json({ message: "Product deleted." });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => {
  console.log("Inventory Tracker running at http://localhost:3000");
});
