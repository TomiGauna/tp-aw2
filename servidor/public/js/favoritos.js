const favoritosContainer = document.getElementById("favoritos");
const vaciarFavoritosBtn = document.getElementById("vaciar-favoritos");

function renderFavorites() {
  if (!favoritosContainer) return;

  const favorites = getFavorites();

  favoritosContainer.innerHTML = "";

  if (favorites.length === 0) {
    favoritosContainer.innerHTML = `<p class="empty-state">No tienes favoritos aún ⭐</p>`;
    return;
  }

  favorites.forEach(producto => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">

      <div class="product-info">
        <p class="categoria">${producto.categoria || "Producto"}</p>
        <h3>${producto.nombre}</h3>

        <div class="product-bottom">
          <p class="card-price">$${producto.precio}</p>
          <button class="btn-add">Agregar</button>
          <button class="btn btn-danger btn-remove-fav">Quitar</button>
        </div>
      </div>
    `;

    card.querySelector(".btn-add").addEventListener("click", () => {
      addToCart(producto);
    });

    card.querySelector(".btn-remove-fav").addEventListener("click", () => {
      toggleFavorite(producto);
      renderFavorites();
    });

    favoritosContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();

  if (vaciarFavoritosBtn) {
    vaciarFavoritosBtn.addEventListener("click", () => {
      localStorage.removeItem(FAVORITES_KEY);
      updateCounters();
      renderFavorites();
    });
  }
});