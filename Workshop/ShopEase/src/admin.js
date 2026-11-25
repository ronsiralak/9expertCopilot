/**
 * Browser-local product administration for the demo.
 */
let adminProducts = [];
let adminBusy = false;

function adminStatus(message) {
  document.getElementById("admin-status").textContent = message;
}

function renderAdminProducts() {
  const body = document.getElementById("admin-products");
  body.replaceChildren();
  for (const product of adminProducts) {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.textContent = product.name;
    row.appendChild(name);
    for (const field of ["price", "stock"]) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.id = `admin-edit-${field}-${product.id}`;
      input.type = "number";
      input.min = "0";
      input.step = field === "price" ? "0.01" : "1";
      input.required = true;
      input.value = product[field];
      input.setAttribute("aria-label", `${field} for ${product.name}`);
      input.addEventListener("change", () => editProduct(product.id, field, input));
      cell.appendChild(input);
      row.appendChild(cell);
    }
    const category = document.createElement("td");
    category.textContent = product.category;
    row.appendChild(category);
    const actions = document.createElement("td");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.id = `admin-delete-${product.id}`;
    remove.className = "remove-btn";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${product.name}`);
    remove.addEventListener("click", () => deleteProduct(product));
    actions.appendChild(remove);
    row.appendChild(actions);
    body.appendChild(row);
  }
}

async function updateAdminProducts(update, fallbackFocusId = "") {
  if (adminBusy) return;
  adminBusy = true;
  const content = document.getElementById("admin-content");
  const focused = document.activeElement;
  const focusId = focused && content.contains(focused) ? focused.id : fallbackFocusId;
  content.inert = true;
  try {
    const latest = await fetchProducts();
    const updated = update(latest);
    saveProducts(updated);
    adminProducts = updated;
    renderAdminProducts();
    adminStatus("Changes saved in this browser.");
    return true;
  } catch (error) {
    console.error("Could not save product changes:", error);
    adminStatus(`Could not save changes: ${error.message}`);
    renderAdminProducts();
    return false;
  } finally {
    adminBusy = false;
    content.inert = false;
    if (focusId && document.activeElement &&
        (document.activeElement === document.body || document.activeElement === focused)) {
      const target = document.getElementById(focusId) ||
        document.getElementById("admin-name");
      target.focus();
    }
  }
}

function editProduct(id, field, input) {
  const value = input.valueAsNumber;
  if (!input.checkValidity() || !Number.isFinite(value) ||
      (field === "stock" && !Number.isSafeInteger(value))) {
    adminStatus(`Enter a valid non-negative ${field}.`);
    renderAdminProducts();
    if (input.id) document.getElementById(input.id).focus();
    return;
  }
  return updateAdminProducts((products) => {
    if (!products.some((product) => product.id === id)) {
      throw new Error("This product no longer exists. Reload the page.");
    }
    return products.map((product) => product.id === id ? { ...product, [field]: value } : product);
  }, input.id);
}

function deleteProduct(product) {
  if (!window.confirm(`Delete "${product.name}"?`)) return;
  return updateAdminProducts((products) => {
    if (!products.some((item) => item.id === product.id)) {
      throw new Error("This product no longer exists. Reload the page.");
    }
    return products.filter((item) => item.id !== product.id);
  }, `admin-delete-${product.id}`);
}

async function addAdminProduct(event) {
  event.preventDefault();
  const name = document.getElementById("admin-name").value.trim();
  const price = document.getElementById("admin-price").valueAsNumber;
  const stock = document.getElementById("admin-stock").valueAsNumber;
  const category = document.getElementById("admin-category").value;
  if (!name || !event.currentTarget.checkValidity() ||
      !Number.isFinite(price) || !Number.isSafeInteger(stock) || stock < 0 || price < 0) {
    adminStatus("Enter a name, valid price, and whole-number stock.");
    return;
  }
  const saved = await updateAdminProducts((products) => {
    const maxId = products.reduce((max, product) => Math.max(max, product.id), 0);
    const lastId = Number(localStorage.getItem("shopease_last_product_id") || 0);
    if (!Number.isSafeInteger(lastId) || lastId < 0) {
      throw new Error("Invalid product ID counter.");
    }
    const id = Math.max(Date.now(), maxId + 1, lastId + 1);
    localStorage.setItem("shopease_last_product_id", String(id));
    return [...products, {
      id, name, price, stock, category, emoji: "📦", description: "No description available.",
      rating: 0, reviews: 0,
    }];
  }, "admin-add-button");
  if (saved) document.getElementById("admin-add-form").reset();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    adminProducts = await fetchProducts();
  } catch (error) {
    console.error("Could not load products:", error);
    adminStatus("Unable to load products. Please reload the page and try again.");
    return;
  }
  renderAdminProducts();
  document.getElementById("admin-add-form").addEventListener("submit", addAdminProduct);
  document.getElementById("admin-content").hidden = false;
  adminStatus("");
});
