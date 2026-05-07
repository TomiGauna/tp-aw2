const CART_KEY = "carrito";
const FAVORITES_KEY = "favoritos";
const footerBtn = document.getElementById("footer-btn");
const footerInput = document.getElementById("footer-input");

const loginBtn = document.getElementById("login-btn");
const loginInput = document.querySelectorAll(".login-input");

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

function updateCartCounter() {
  const bagCount = document.getElementById("bag-count");
  if (!bagCount) return;

  const cart = getCart();
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  bagCount.textContent = totalItems;
}

function updateFavoritesCounter() {
  const favCount = document.getElementById("fav-count");
  if (!favCount) return;

  favCount.textContent = getFavorites().length;
}

function updateCounters() {
  updateCartCounter();
  updateFavoritesCounter();
}

function showMessage(text, type = "ok") {
  const msg = document.getElementById("mensaje");

  if (!msg) {
  console.warn("Mensaje no mostrado:", text);
  return;
 }

  msg.textContent = text;
  msg.classList.remove("mensaje-oculto");
  msg.style.background = type === "error" ? "#e74c3c" : "#4caf50";
  msg.classList.add("visible");

  setTimeout(() => {
    msg.classList.remove("visible");

    setTimeout(() => {
      msg.classList.add("mensaje-oculto");
    }, 400);
  }, 2000);
}

function addToCart(product) {
  const cart = getCart();
  const stock = Number(product.stock) || 0;

  if (stock <= 0) {
    showMessage("Este producto no tiene stock", "error");
    return;
  }

  const existingProduct = cart.find(item => String(item.id) === String(product.id));

  if (existingProduct) {
    if (existingProduct.qty >= stock) {
      showMessage(`Solo hay ${stock} unidad/es disponibles`, "error");
      return;
    }

    existingProduct.qty++;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: Number(product.precio),
      precioOriginal: product.precioOriginal || Number(product.precio),
      imagen: product.imagen,
      categoria: product.categoria || "",
      descripcion: product.descripcion || "",
      talle: product.talle || "",
      stock: stock,
      descuento: product.descuento || 0,
      qty: 1
    });
  }

  saveCart(cart);
  updateCounters();
  showMessage("Producto agregado al carrito");
}

function toggleFavorite(product) {
  let favorites = getFavorites();
  const exists = favorites.some(item => String(item.id) === String(product.id));

  if (exists) {
    favorites = favorites.filter(item => String(item.id) !== String(product.id));
    showMessage("Producto eliminado de favoritos");
  } else {
    favorites.push({
      id: product.id,
      nombre: product.nombre,
      precio: Number(product.precio),
      imagen: product.imagen,
      categoria: product.categoria || ""
    });
    showMessage("Producto agregado a favoritos");
  }

  saveFavorites(favorites);
  updateCounters();

  return !exists;
}

function isFavorite(id) {
  return getFavorites().some(item => String(item.id) === String(id));
}

document.addEventListener("DOMContentLoaded", updateCounters);

if (footerBtn) {
  footerBtn.addEventListener('click', () => {
    console.log(footerInput.value)
    if (footerInput.value) {
      showMessage("Te has suscripto exitosamente!");
      footerInput.value = null;
      return;
    }

    showMessage("Debes ingresar tu correo electrónico", "error")
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginInput.value = "";
    showMessage("El panel se encuentra en mantenimento...", "error");
})
}
