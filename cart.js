let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

cart.forEach(item => {
  document.getElementById("cartItems").innerHTML +=
    `<tr><td>${item.name}</td><td>₹${item.price}</td></tr>`;
  total += item.price;
});

document.getElementById("total").innerText = total;
