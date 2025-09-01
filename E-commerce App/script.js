document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.99 },
    { id: 2, name: "Product 2", price: 19.99 },
    { id: 3, name: "Product 3", price: 59.999 },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");

  // Initial render to show saved cart items
  renderCart();

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
    <span>${product.name} - $${product.price.toFixed(2)}</span>
    <button data-id="${product.id}">Add to cart</button>
    `;
    productList.appendChild(productDiv);
  });

  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      addToCart(product);
    }
  });

  function addToCart(product) {
    cart.push(product);
    saveCart(); // Add this line
    renderCart();
  }

  function renderCart() {
    cartItems.innerText = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotalMessage.classList.remove("hidden");
      // cart.forEach((item, index) => {
      //   totalPrice += item.price;
      //   const cartItem = document.createElement("div");
      //   cartItem.innerHTML = `
      //   ${item.name} - $${item.price.toFixed(2)}
      //   `;
      //   cartItems.appendChild(cartItem);
      //   totalPriceDisplay.textContent = `${totalPrice.toFixed(2)}`;
      // });

      // Assisnment to add Delete Button
      // Inside renderCart()
      cart.forEach((item, index) => {
        // Notice we're using 'index'
        totalPrice += item.price;
        const cartItem = document.createElement("div");
        // Add a class for styling the cart item if you want
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
    <span>${item.name} - $${item.price.toFixed(2)}</span>
    <button class="delete-btn" data-index="${index}">Remove</button>
  `;
        cartItems.appendChild(cartItem);
        totalPriceDisplay.textContent = `${totalPrice.toFixed(2)}`;
      });
    } else {
      emptyCartMessage.classList.remove("hidden");
      totalPriceDisplay.textContent = `$0.00`;
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  // Add this new event listener
  cartItems.addEventListener("click", (e) => {
    // Check if a remove button was clicked
    if (e.target.classList.contains("delete-btn")) {
      // Get the index from the data-index attribute
      const itemIndex = parseInt(e.target.getAttribute("data-index"));

      // Remove the item from the cart array
      removeFromCart(itemIndex);
    }
  });

  // Add this new function
  function removeFromCart(index) {
    // Remove 1 item at the given index from the cart array
    cart.splice(index, 1);
    saveCart(); // Add this line

    // Re-render the cart to show the changes
    renderCart();
  }

  checkOutBtn.addEventListener("click", () => {
    cart.length = 0;
    saveCart(); // Add this line
    alert("Checkout successfully");
    renderCart();
  });
});
