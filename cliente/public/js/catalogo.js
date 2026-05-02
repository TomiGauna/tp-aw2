const API_URL = "https://69e4e816cfa9394db8da8480.mockapi.io/products";

let productos = [];
let productosFiltrados = [];

const catalogo = document.getElementById("catalogo");
const buscar = document.getElementById("buscar");
const ordenar = document.getElementById("ordenar");
const categorias = document.querySelectorAll(".categorias-lista li");
const categoriasFooter = document.querySelectorAll(".footer-col a")

function calcularPrecioFinal(producto) {
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;

  if (descuento > 0) {
    return precio - (precio * descuento / 100);
  }

  return precio;
}

function normalizarProducto(p) {
  const precioFinal = calcularPrecioFinal(p);

  return {
    id: p.id,
    nombre: p.nombre || "Producto sin nombre",
    precio: precioFinal,
    precioOriginal: Number(p.precio) || 0,
    categoria: p.categoria || "Sin categoría",
    imagen: p.imagen || "https://via.placeholder.com/400x500?text=Sin+imagen",
    descripcion: p.descripcion || "",
    stock: Number(p.stock) || 0,
    talle: p.talle || "",
    descuento: Number(p.descuento) || 0
  };
}

async function cargarCatalogo() {
  if (!catalogo) return;

  try {
    catalogo.innerHTML = `<p class="empty-state">Cargando productos...</p>`;

    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Error al cargar productos");
    }

    const data = await res.json();

    productos = data.map(normalizarProducto);
    productosFiltrados = [...productos];

    renderCatalogo(productosFiltrados);

  } catch (error) {
    console.error(error);
    catalogo.innerHTML = `<p class="empty-state">No se pudieron cargar los productos.</p>`;
  }
}

function renderCatalogo(lista) {
  catalogo.innerHTML = "";

  if (lista.length === 0) {
    catalogo.innerHTML = `<p class="empty-state">No hay productos disponibles.</p>`;
    return;
  }

  lista.forEach(producto => {
    const card = document.createElement("article");
    card.className = "product-card";

    const favActive = isFavorite(producto.id) ? "★" : "☆";

    card.innerHTML = `
  <div class="product-image-wrap">
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <button class="btn-fav" title="Agregar a favoritos">${favActive}</button>
  </div>

  <div class="product-info">
    <p class="categoria">${producto.categoria}</p>
    <h3>${producto.nombre}</h3>

    <p class="descripcion">${producto.descripcion}</p>

    <div class="product-meta">
      ${producto.talle ? `<span>Talle: ${producto.talle}</span>` : ""}
      <span class="${producto.stock > 0 ? "stock-ok" : "stock-out"}">
        ${producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock"}
      </span>
    </div>

    <div class="price-box">
      ${
        producto.descuento > 0
          ? `
            <p class="old-price">$${producto.precioOriginal}</p>
            <p class="card-price">$${producto.precio.toFixed(0)}</p>
            <span class="discount">${producto.descuento}% OFF</span>
          `
          : `<p class="card-price">$${producto.precio}</p>`
      }
    </div>

    <div class="product-actions">
      <a href="/producto/${producto.id}" class="btn-detail">
        Ver detalle
      </a>

      <button class="btn-add" ${producto.stock <= 0 ? "disabled" : ""}>
        ${producto.stock > 0 ? "Agregar" : "Sin stock"}
      </button>
    </div>
  </div>
`;

    card.querySelector(".btn-add").addEventListener("click", () => {
      addToCart(producto);
    });

    card.querySelector(".btn-fav").addEventListener("click", () => {
      toggleFavorite(producto);
      renderCatalogo(productosFiltrados);
    });

    catalogo.appendChild(card);
  });
}

function aplicarFiltros() {
  const texto = buscar.value.toLowerCase().trim();
  const orden = ordenar.value;

  productosFiltrados = productos.filter(producto => {
    return (
      producto.nombre.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto) ||
      producto.descripcion.toLowerCase().includes(texto)
    );
  });

  if (orden === "nombre-asc") {
    productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  if (orden === "precio-asc") {
    productosFiltrados.sort((a, b) => a.precio - b.precio);
  }

  if (orden === "precio-desc") {
    productosFiltrados.sort((a, b) => b.precio - a.precio);
  }

  renderCatalogo(productosFiltrados);
}

function filtrarPorCategoria(categoria) {
  if (categoria === "Todos") {
    productosFiltrados = [...productos];
  } else {
    productosFiltrados = productos.filter(producto =>
      producto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  renderCatalogo(productosFiltrados);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCatalogo();

  buscar.addEventListener("input", aplicarFiltros);
  ordenar.addEventListener("change", aplicarFiltros);

  categorias.forEach(cat => {
    cat.addEventListener("click", () => {
      categorias.forEach(c => c.classList.remove("active-category"));
      cat.classList.add("active-category");
      filtrarPorCategoria(cat.textContent.trim());
    });
  });

  categoriasFooter.forEach(cat => {
    cat.addEventListener("click", () => {
      filtrarPorCategoria(cat.textContent.trim());
    });
  });
});