function mostrarConfirmacion() {
  const params = new URLSearchParams(location.search);
  const info = document.getElementById("info");

  if (!info) return;

  let cart = [];

  try {
    cart = JSON.parse(params.get("cartSummary") || "[]");
  } catch (error) {
    cart = [];
  }

  const total = cart.reduce((acc, item) => acc + item.precio * item.qty, 0);

  info.innerHTML = `
    <p><strong>Nombre:</strong> ${params.get("fullname") || "-"}</p>
    <p><strong>Email:</strong> ${params.get("email") || "-"}</p>
    <p><strong>Dirección:</strong> ${params.get("address") || "-"}</p>
    <p><strong>Método de pago:</strong> ${params.get("paymentMethod") || "-"}</p>

    <h3>Productos</h3>

    ${
      cart.length === 0
        ? "<p>No hay productos en la compra.</p>"
        : `<ul>
            ${cart.map(item => `
              <li>${item.nombre} - $${item.precio} x ${item.qty}</li>
            `).join("")}
          </ul>`
    }

    <p><strong>Total:</strong> $${total}</p>
  `;

  localStorage.removeItem(CART_KEY);
}

document.addEventListener("DOMContentLoaded", mostrarConfirmacion);