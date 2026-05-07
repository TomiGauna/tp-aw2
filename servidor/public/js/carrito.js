/* =============================
   RENDER CARRITO
============================= */
function mostrarCarrito() {
  const cont = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const resumen = document.getElementById("cart-summary");

  if (!cont || !totalEl) return;

  const cart = getCart();

  cont.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cont.innerHTML = "<p class='empty-cart'>Tu carrito está vacío 🛒</p>";
    totalEl.textContent = 0;

    if (resumen) {
      resumen.value = "";
    }

    return;
  }

  cart.forEach(item => {
    const precio = Number(item.precio);
    const stock = Number(item.stock) || 0;
    const subtotal = item.qty * precio;

    total += subtotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-card">
        <img src="${item.imagen}" alt="${item.nombre}" class="cart-img">

        <div class="cart-info">
          <h3>${item.nombre}</h3>
          <p class="price">$${precio}</p>

          <div class="qty-controls">
            <button class="qty-btn restar">−</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-btn sumar" ${item.qty >= stock ? "disabled" : ""}>+</button>
          </div>

          <p class="stock-cart">Stock disponible: ${stock}</p>
        </div>

        <div class="cart-side">
          <p class="subtotal">$${subtotal}</p>
          <button class="btn btn-danger eliminar">Eliminar</button>
        </div>
      </div>
    `;

    div.querySelector(".sumar").addEventListener("click", () => {
      if (item.qty >= stock) {
        showMessage(`Solo hay ${stock} unidad/es disponibles`, "error");
        return;
      }

      item.qty++;
      saveCart(cart);
      updateCounters();
      mostrarCarrito();
    });

    div.querySelector(".restar").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        eliminar(item.id);
        return;
      }

      saveCart(cart);
      updateCounters();
      mostrarCarrito();
    });

    div.querySelector(".eliminar").addEventListener("click", () => {
      eliminar(item.id);
    });

    cont.appendChild(div);
  });

  totalEl.textContent = total;

  if (resumen) {
    resumen.value = JSON.stringify(cart);
  }
}

/* =============================
   ELIMINAR PRODUCTO
============================= */
function eliminar(id) {
  let cart = getCart();

  cart = cart.filter(p => String(p.id) !== String(id));

  saveCart(cart);
  updateCounters();
  mostrarCarrito();
  showMessage("Producto eliminado del carrito");
}

/* =============================
   INIT CARRITO
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const vaciarBtn = document.getElementById("vaciar-carrito");
  const form = document.getElementById("form-pago");

  if (vaciarBtn) {
    vaciarBtn.addEventListener("click", () => {
      localStorage.removeItem(CART_KEY);
      updateCounters();
      mostrarCarrito();
      showMessage("Carrito vaciado");
    });
  }

  if (form) {
    form.addEventListener("submit", (e) => {
      const cart = getCart();

      if (cart.length === 0) {
        e.preventDefault();
        showMessage("El carrito está vacío", "error");
      }
    });
  }

  mostrarCarrito();
});