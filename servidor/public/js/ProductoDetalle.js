const API_URL = "https://69e4e816cfa9394db8da8480.mockapi.io/products";

const detalleContainer = document.getElementById("producto-detalle");

function calcularPrecioFinal(producto) {
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;

  if (descuento > 0) {
    return precio - (precio * descuento / 100);
  }

  return precio;
}

function normalizarProducto(p) {
  return {
    id: p.id,
    nombre: p.nombre || "Producto sin nombre",
    precio: calcularPrecioFinal(p),
    precioOriginal: Number(p.precio) || 0,
    categoria: p.categoria || "Sin categoría",
    imagen: p.imagen || "https://via.placeholder.com/600x700?text=Sin+imagen",
    descripcion: p.descripcion || "",
    stock: Number(p.stock) || 0,
    talle: p.talle || "",
    descuento: Number(p.descuento) || 0
  };
}

async function cargarProductoDetalle() {
  if (!detalleContainer) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detalleContainer.innerHTML = `<p class="empty-state">Producto no encontrado.</p>`;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/${id}`);

    if (!res.ok) {
      throw new Error("No se pudo cargar el producto");
    }

    const data = await res.json();
    const producto = normalizarProducto(data);

    renderProductoDetalle(producto);

  } catch (error) {
    console.error(error);
    detalleContainer.innerHTML = `<p class="empty-state">Error cargando el producto.</p>`;
  }
}

function renderProductoDetalle(producto) {
  const favText = isFavorite(producto.id) ? "★ En favoritos" : "☆ Agregar a favoritos";

  detalleContainer.innerHTML = `
    <div class="detalle-img-box">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>

    <div class="detalle-info">
      <p class="categoria">${producto.categoria}</p>
      <h2>${producto.nombre}</h2>

      <p class="detalle-descripcion">${producto.descripcion}</p>

      <div class="detalle-meta">
        ${producto.talle ? `<span>Talle: ${producto.talle}</span>` : ""}
        <span class="${producto.stock > 0 ? "stock-ok" : "stock-out"}">
          ${producto.stock > 0 ? `Stock disponible: ${producto.stock}` : "Sin stock"}
        </span>
      </div>

      <div class="detalle-precio">
        ${
          producto.descuento > 0
            ? `
              <p class="old-price">$${producto.precioOriginal}</p>
              <p class="precio-final">$${producto.precio.toFixed(0)}</p>
              <span class="discount">${producto.descuento}% OFF</span>
            `
            : `<p class="precio-final">$${producto.precio}</p>`
        }
      </div>

      <div class="detalle-actions">
        <button class="btn-add" id="btn-agregar" ${producto.stock <= 0 ? "disabled" : ""}>
          ${producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </button>

        <button class="btn-fav-detalle" id="btn-favorito">
          ${favText}
        </button>
      </div>
    </div>
  `;

  document.getElementById("btn-agregar").addEventListener("click", () => {
    addToCart(producto);
  });

  document.getElementById("btn-favorito").addEventListener("click", () => {
    toggleFavorite(producto);
    renderProductoDetalle(producto);
  });
}

document.addEventListener("DOMContentLoaded", cargarProductoDetalle);