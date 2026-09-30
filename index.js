let productsContainer = document.getElementById("productsContainer");
let detail = document.getElementById("detailsContainer");
let categorySelect = document.getElementById("categorySelect");
let search = document.getElementById("searchInput");
let paginationContainer = document.getElementById("paginationContainer");

let currentPage = 1;
let productsPerPage = 6;
let products = [];
let cart = [];
let filteredProducts = [];

async function getProducts() {
  try {
    let response = await fetch("https://fakestoreapi.com/products");

    let data = await response.json();

    products = data;
    filteredProducts = [...products];

    let categories = [];

    products.forEach((p) => {
      if (!categories.includes(p.category)) {
        categories.push(p.category);
      }
    });

    categories.forEach((category) => {
      categorySelect.innerHTML += `
        <option value="${category}">${category}</option>
      `;
    });

    displayProducts();

  } catch (error) {
    console.log(error);
  }
}

function displayProducts() {
  productsContainer.innerHTML = "";

  let start = (currentPage - 1) * productsPerPage;
  let end = start + productsPerPage;

  let displayedProducts = filteredProducts.slice(start, end);

  if (displayedProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-12 text-center text-muted py-5">
        No products found.
      </div>
    `;
  }

  displayedProducts.forEach((product) => {
    productsContainer.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100">

          <img
            src="${product.image}"
            class="card-img-top p-3"
            style="height: 300px; object-fit: contain;"
          >

          <div class="card-body">

            <h5 class="card-title">
              ${product.title}
            </h5>

            <h5>
              $${product.price.toFixed(2)}
            </h5>

            <button
              class="btn btn-primary"
              onclick="viewDetails(${product.id})"
            >
              View Details
            </button>

            <button
              class="btn btn-success"
              onclick="addToCart(${product.id})"
            >
              Add to Cart
            </button>

          </div>

        </div>
      </div>
    `;
  });

  displayPagination();
}

function displayPagination() {
  paginationContainer.innerHTML = "";

  let totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (totalPages <= 1) {
    return;
  }

  for (let i = 1; i <= totalPages; i++) {
    let activeClass = i === currentPage ? "btn-primary" : "btn-outline-primary";

    paginationContainer.innerHTML += `
      <button
        class="btn ${activeClass} mx-1"
        onclick="goToPage(${i})"
      >
        ${i}
      </button>
    `;
  }
}

function goToPage(page) {
  currentPage = page;
  displayProducts();
  window.scrollTo({ top: productsContainer.offsetTop - 20, behavior: "smooth" });
}

function next() {
  let totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (currentPage < totalPages) {
    currentPage++;

    displayProducts();
  }
}

function previous() {
  if (currentPage > 1) {
    currentPage--;

    displayProducts();
  }
}

getProducts();

function viewDetails(id) {
  let product = products.find((p) => p.id === id);

  if (!product) return;

  detail.innerHTML = `

        <div class="position-fixed top-0 start-0 w-100 h-100
                    bg-dark bg-opacity-50 d-flex justify-content-center
                    align-items-center">

            <div class="card p-3" style="width: 400px;">

                <button
                    onclick="closeDetails()"
                    class="btn-close ms-auto">
                </button>

                <img
                    src="${product.image}"
                    class="card-img-top p-3"
                    style="height: 250px; object-fit: contain;"
                >

                <div class="card-body">

                    <h5 class="card-title">
                        ${product.title}
                    </h5>

                    <p>
                        ${product.description}
                    </p>

                    <h5>
                        $${product.price.toFixed(2)}
                    </h5>

                    <p>
                        Category: ${product.category}
                    </p>

                </div>

            </div>

        </div>

    `;
}

function closeDetails() {
  detail.innerHTML = "";
}


function addToCart(id) {
  let product = products.find((p) => p.id === id);

  if (!product) return;

  cart.push(product);

  displayCart();
}

function displayCart() {
  let cartContainer = document.getElementById("cartContainer");

  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach((product, index) => {
    total += product.price;

    cartContainer.innerHTML += `

            <div class="card mb-2 p-2">

                <div class="d-flex align-items-center">

                    <img
                        src="${product.image}"
                        style="width: 70px; height: 70px; object-fit: contain;"
                    >

                    <div class="ms-3 flex-grow-1">

                        <h6>${product.title}</h6>

                        <p class="mb-0">$${product.price.toFixed(2)}</p>

                    </div>

                    <button
                        class="btn btn-danger"
                        onclick="deleteFromCart(${index})">
                        Delete
                    </button>

                </div>

            </div>

        `;
  });

  cartContainer.innerHTML += `

        <hr>

        <h5>Total Quantity: ${cart.length}</h5>

        <h5>Total: $${total.toFixed(2)}</h5>

    `;
}

function deleteFromCart(index) {
  cart.splice(index, 1);

  displayCart();
}


function search_products() {

  let searchValue = search.value.toLowerCase();

  let selectedCategory = categorySelect.value;

  let min = Number(minPrice.value);

  let max = Number(maxPrice.value);


  filteredProducts = products.filter((p) => {

    let matchSearch =
      p.title.toLowerCase().includes(searchValue);


    let matchCategory =
      selectedCategory === "" ||
      p.category === selectedCategory;


    let matchMinPrice =
      minPrice.value === "" ||
      p.price >= min;


    let matchMaxPrice =
      maxPrice.value === "" ||
      p.price <= max;


    return (
      matchSearch &&
      matchCategory &&
      matchMinPrice &&
      matchMaxPrice
    );

  });


  currentPage = 1;

  displayProducts();
}



function sortProducts() {

  let sortValue = sortByPrice.value;

  if (sortValue === "asc") {

    filteredProducts.sort((a, b) => {
      return a.price - b.price;
    });

  }

  else if (sortValue === "desc") {

    filteredProducts.sort((a, b) => {
      return b.price - a.price;
    });

  }

  else {

    filteredProducts = [...products];

  }

  currentPage = 1;

  displayProducts();
}



function clearFilters() {
  search.value = "";
  categorySelect.value = "";
  minPrice.value = "";
  maxPrice.value = "";
  sortByPrice.value = "";

  filteredProducts = [...products];

  currentPage = 1;

  displayProducts();
}
