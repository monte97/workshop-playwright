// Common utilities and functions used across pages

// Check authentication and update UI
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');

    if (response.ok) {
      const user = await response.json();
      updateAuthUI(user);
      return user;
    } else {
      updateAuthUI(null);
      return null;
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    updateAuthUI(null);
    return null;
  }
}

// Update authentication UI elements
function updateAuthUI(user) {
  const userGreeting = document.getElementById('userGreeting');
  const loginLink = document.getElementById('loginLink');
  const ordersLink = document.getElementById('ordersLink');
  const logoutBtn = document.getElementById('logoutBtn');

  if (user) {
    if (userGreeting) {
      userGreeting.textContent = `Ciao, ${user.name}!`;
      userGreeting.classList.remove('hidden');
    }
    if (loginLink) loginLink.classList.add('hidden');
    if (ordersLink) ordersLink.classList.remove('hidden');
    if (logoutBtn) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.addEventListener('click', logout);
    }
  } else {
    if (userGreeting) userGreeting.classList.add('hidden');
    if (loginLink) loginLink.classList.remove('hidden');
    if (ordersLink) ordersLink.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }
}

// Logout function
async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    console.error('Error logging out:', error);
  }
}

// Update cart badge
async function updateCartBadge() {
  try {
    const response = await fetch('/api/cart');
    const cart = await response.json();

    const badge = document.getElementById('cartBadge');
    if (badge) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error updating cart badge:', error);
  }
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Format date
function formatDate(dateString) {
  return new Intl.DateTimeFormat('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

// Initialize common functionality on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  updateCartBadge();
});
