
const form = document.getElementById("productForm");
const table = document.getElementById("productTable");
const search = document.getElementById("search");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const cancelEdit = document.getElementById("cancelEdit");

let editingId = null;
let products = [];

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#dc2626" : "#15803d";
}

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

async function loadStats() {
  const stats = await request("/api/stats");

  document.getElementById("totalProducts").textContent =
    stats.totalProducts;

  document.getElementById("totalUnits").textContent =
    stats.totalUnits;

  document.getElementById("stockValue").textContent =
    Number(stats.stockValue).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR"
    });

  document.getElementById("lowStock").textContent =
    stats.lowStock;
}

async function loadProducts() {
  try {
    products = await request(
      "/api/products?search=" + encodeURIComponent(search.value.trim())
    );

    renderProducts();
    await loadStats();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function renderProducts() {
  table.replaceChildren();

  if (products.length === 0) {
    const row = table.insertRow();
    const cell = row.insertCell();
    cell.colSpan = 8;
    cell.textContent = "No products found. Add your first product above.";
    return;
  }

  products.forEach(product => {
    const row = table.insertRow();

    [
      product.id,
      product.name,
      product.sku,
      product.category,
      Number(product.price).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
      })
    ].forEach(value => {
      row.insertCell().textContent = value;
    });

    row.insertCell().textContent = product.quantity;

    const statusCell = row.insertCell();
    const badge = document.createElement("span");
    const isLow = product.quantity <= product.min_stock;

    badge.className = isLow ? "stock-low" : "stock-ok";
    badge.textContent = isLow ? "Low Stock" : "In Stock";
    statusCell.appendChild(badge);

    const actionsCell = row.insertCell();

    const editButton = document.createElement("button");
    editButton.className = "edit-btn";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editProduct(product.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteProduct(product.id));

    actionsCell.append(editButton, deleteButton);
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    sku: document.getElementById("sku").value.trim(),
    category: document.getElementById("category").value.trim(),
    price: document.getElementById("price").value,
    quantity: Number(document.getElementById("quantity").value),
    min_stock: Number(document.getElementById("min_stock").value)
  };

  const url = editingId === null
    ? "/api/products"
    : `/api/products/${editingId}`;

  const method = editingId === null ? "POST" : "PUT";

  try {
    await request(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    showMessage(editingId === null
      ? "Product added successfully!"
      : "Product updated successfully!");

    resetForm();
    await loadProducts();
  } catch (error) {
    showMessage(error.message, true);
  }
});

function editProduct(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  editingId = id;

  ["name", "sku", "category", "price", "quantity", "min_stock"]
    .forEach(field => {
      document.getElementById(field).value = product[field];
    });

  document.getElementById("formHeading").textContent = "Edit Product";
  submitBtn.textContent = "Save Changes";
  cancelEdit.hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await request(`/api/products/${id}`, { method: "DELETE" });
    showMessage("Product deleted successfully!");
    await loadProducts();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function resetForm() {
  form.reset();
  editingId = null;
  document.getElementById("min_stock").value = 5;
  document.getElementById("formHeading").textContent = "Add New Product";
  submitBtn.textContent = "Add Product";
  cancelEdit.hidden = true;
}

cancelEdit.addEventListener("click", () => {
  resetForm();
  showMessage("Edit cancelled.");
});

search.addEventListener("input", loadProducts);

loadProducts();
