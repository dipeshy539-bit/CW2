// --- Toggle album details ---
function toggleDetails(button) {
  const card = button.closest('.album-card'); // find the parent card
  const details = card.querySelector('.album-details'); // find details inside card
  if (!details) return;

  details.classList.toggle('show');
  button.textContent = details.classList.contains('show')
    ? 'Hide Details'
    : 'Show Details';
}

// --- Cart system using LocalStorage ---
function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  updateCartList();
}

function addToCart(itemName, price) {
  const cart = getCart();
  cart.push({ name: itemName, price: price });   // ✅ store as object
  saveCart(cart);
  showMessage(`${itemName} added to cart!`, '#B71C1C'); // Deep Red for success
}

function clearCart() {
  localStorage.removeItem('cart');
  updateCartCount();
  updateCartList();
  showMessage('Cart cleared.', '#8B0000'); // Dark Red
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = getCart().length;
  }
}

function updateCartList() {
  const list = document.getElementById('cartItems');
  if (!list) return;

  const cart = getCart();
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = '<li>Your cart is empty.</li>';
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} - £${item.price}</span>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    list.appendChild(li);
  });
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  showMessage('Item removed from cart.', '#D32F2F'); // Bright Red for removal
}

// --- Status message helper ---
function showMessage(msg, color = '#000000') { // Default black text on white background
  let status = document.getElementById('cartStatus');
  if (!status) {
    status = document.createElement('div');
    status.id = 'cartStatus';
    status.style.marginTop = '10px';
    status.style.fontWeight = '600';
    status.style.transition = 'opacity 0.5s ease'; // fade effect
    document.body.appendChild(status);
  }
  status.textContent = msg;
  status.style.color = color;
  status.style.backgroundColor = '#FFEBEE'; // very light red background
  status.style.padding = '6px';
  status.style.borderRadius = '4px';
  status.style.opacity = '1';

  setTimeout(() => {
    status.style.opacity = '0';
  }, 2500);
}

// --- Page init ---
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateCartList();
  setupSearch();
  setupContactForm();
});

// --- Simple search filter for visible cards ---
function setupSearch() {
  const input = document.getElementById('searchInput') || document.querySelector('.search-bar');
  if (!input) return;

  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();

    document.querySelectorAll('.album-card, .product-card').forEach(card => {
      const name = (
        card.getAttribute('data-name') ||
        card.querySelector('h4')?.textContent ||
        card.querySelector('.album-details')?.textContent ||
        ''
      ).toLowerCase();

      card.style.display = name.includes(term) ? '' : 'none';
    });
  });
}

// --- Contact form validation ---
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const status = document.getElementById('formStatus');

    // Required fields check
    if (!name?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
      e.preventDefault();
      status.textContent = 'Please fill in all required fields.';
      status.style.color = '#D32F2F';
      return;
    }

    // Name: no digits allowed
    if (/\d/.test(name.value)) {
      e.preventDefault();
      status.textContent = 'Name cannot contain numbers.';
      status.style.color = '#D32F2F';
      return;
    }

    // Email: must contain @ and domain
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    if (!emailOk) {
      e.preventDefault();
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#D32F2F';
      return;
    }

    // Success
    status.textContent = `Thank you for contacting us, ${name.value}!`;
    status.style.color = '#B71C1C';
    status.style.backgroundColor = '#FFEBEE';
    status.style.padding = '6px';
    status.style.borderRadius = '4px';
  });
}